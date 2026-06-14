import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchVillaDto } from './dto/search-villa.dto';

@Injectable()
export class VillasService {
  constructor(private prisma: PrismaService) {}

  // GET /api/villas
  async findAll() {
    const villas = await this.prisma.villa.findMany({
      include: { images: { take: 1 } },
      orderBy: { rating: 'desc' },
    });
    return villas.map((v) => ({
      id: v.id,
      name: v.name,
      location: v.location,
      price: v.price,
      rating: v.rating,
      image_url: v.images[0]?.imageUrl ?? null,
    }));
  }

  // GET /api/villas/search?location=Bali&min_price=500000&max_price=2000000
  async search(dto: SearchVillaDto) {
    const { location, check_in, check_out, guest_count, min_price, max_price } = dto;

    // Cari villa yang sudah dipesan di range tanggal tersebut (cegah double-booking)
    let bookedVillaIds: number[] = [];
    if (check_in && check_out) {
      const conflicts = await this.prisma.booking.findMany({
        where: {
          status: { in: ['PENDING', 'CONFIRMED'] },
          AND: [
            { checkIn: { lt: new Date(check_out) } },
            { checkOut: { gt: new Date(check_in) } },
          ],
        },
        select: { villaId: true },
      });
      bookedVillaIds = conflicts.map((b) => b.villaId);
    }

    const villas = await this.prisma.villa.findMany({
      where: {
        ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
        ...(min_price !== undefined ? { price: { gte: Number(min_price) } } : {}),
        ...(max_price !== undefined ? { price: { lte: Number(max_price) } } : {}),
        ...(guest_count !== undefined ? { capacity: { gte: Number(guest_count) } } : {}),
        ...(bookedVillaIds.length > 0 ? { id: { notIn: bookedVillaIds } } : {}),
      },
      include: { images: { take: 1 } },
      orderBy: { rating: 'desc' },
    });

    return {
      total: villas.length,
      results: villas.map((v) => ({
        id: v.id,
        name: v.name,
        location: v.location,
        price: v.price,
        rating: v.rating,
        capacity: v.capacity,
        image_url: v.images[0]?.imageUrl ?? null,
      })),
    };
  }

  // GET /api/villas/:id
  async findOne(id: number) {
    const villa = await this.prisma.villa.findUnique({
      where: { id },
      include: {
        images: true,
        facilities: { include: { facility: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!villa) throw new NotFoundException('Villa tidak ditemukan');

    return {
      id: villa.id,
      name: villa.name,
      location: villa.location,
      description: villa.description,
      price: villa.price,
      capacity: villa.capacity,
      rating: villa.rating,
      images: villa.images.map((img) => img.imageUrl),
      facilities: villa.facilities.map((vf) => ({
        id: vf.facility.id,
        name: vf.facility.name,
        icon: vf.facility.icon,
      })),
      reviews: villa.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.createdAt,
        user: r.user,
      })),
      total_reviews: villa.reviews.length,
    };
  }
}
