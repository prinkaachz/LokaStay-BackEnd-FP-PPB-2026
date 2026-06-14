import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // POST /api/reviews
  async create(userId: number, dto: CreateReviewDto) {
    const villa = await this.prisma.villa.findUnique({
      where: { id: dto.villa_id },
    });
    if (!villa) throw new NotFoundException('Villa tidak ditemukan');

    // Cek user pernah booking villa ini (hanya user yang sudah booking bisa review)
    const completedBooking = await this.prisma.booking.findFirst({
      where: {
        userId,
        villaId: dto.villa_id,
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
    });
    if (!completedBooking)
      throw new BadRequestException(
        'Kamu hanya bisa memberikan review untuk villa yang sudah pernah kamu booking',
      );

    // Cek apakah sudah pernah review villa ini
    const existingReview = await this.prisma.review.findFirst({
      where: { userId, villaId: dto.villa_id },
    });
    if (existingReview)
      throw new BadRequestException('Kamu sudah memberikan review untuk villa ini');

    const review = await this.prisma.review.create({
      data: {
        userId,
        villaId: dto.villa_id,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        villa: { select: { id: true, name: true } },
      },
    });

    // Update rata-rata rating villa
    await this.updateVillaRating(dto.villa_id);

    return {
      message: 'Review berhasil dikirim',
      data: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.createdAt,
        user: review.user,
        villa: review.villa,
      },
    };
  }

  // GET /api/reviews/my — review yang pernah dibuat user ini
  async findMyReviews(userId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      include: {
        villa: { include: { images: { take: 1 } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.createdAt,
      villa_id: r.villaId,
      villa_name: r.villa.name,
      image_url: r.villa.images[0]?.imageUrl ?? null,
    }));
  }

  // Helper: update rata-rata rating villa setelah review baru
  private async updateVillaRating(villaId: number) {
    const result = await this.prisma.review.aggregate({
      where: { villaId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const newRating = result._avg.rating ?? 0;
    await this.prisma.villa.update({
      where: { id: villaId },
      data: { rating: Math.round(newRating * 10) / 10 }, // 1 desimal
    });
  }
}
