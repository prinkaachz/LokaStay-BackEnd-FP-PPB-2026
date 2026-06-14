import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  // POST /api/favorites
  async create(userId: number, dto: CreateFavoriteDto) {
    const villa = await this.prisma.villa.findUnique({
      where: { id: dto.villa_id },
    });
    if (!villa) throw new NotFoundException('Villa tidak ditemukan');

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_villaId: { userId, villaId: dto.villa_id } },
    });
    if (existing) throw new ConflictException('Villa sudah ada di favorit');

    const favorite = await this.prisma.favorite.create({
      data: { userId, villaId: dto.villa_id },
      include: { villa: { include: { images: { take: 1 } } } },
    });

    return {
      message: 'Berhasil ditambahkan ke favorit',
      data: {
        id: favorite.id,
        villa_id: favorite.villaId,
        villa_name: favorite.villa.name,
        villa_location: favorite.villa.location,
        villa_price: favorite.villa.price,
        villa_rating: favorite.villa.rating,
        image_url: favorite.villa.images[0]?.imageUrl ?? null,
      },
    };
  }

  // DELETE /api/favorites/:id
  async remove(userId: number, id: number) {
    const favorite = await this.prisma.favorite.findFirst({
      where: { id, userId },
    });
    if (!favorite)
      throw new NotFoundException('Favorit tidak ditemukan atau bukan milikmu');

    await this.prisma.favorite.delete({ where: { id } });
    return { message: 'Berhasil dihapus dari favorit' };
  }

  // GET /api/favorites
  async findAll(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: { villa: { include: { images: { take: 1 } } } },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => ({
      id: f.id,
      villa_id: f.villaId,
      villa_name: f.villa.name,
      villa_location: f.villa.location,
      villa_price: f.villa.price,
      villa_rating: f.villa.rating,
      image_url: f.villa.images[0]?.imageUrl ?? null,
    }));
  }
}
