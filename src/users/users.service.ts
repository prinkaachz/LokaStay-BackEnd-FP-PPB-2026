import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // GET /api/user/profile
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phoneNumber,
      avatar_url: user.avatarUrl,
      created_at: user.createdAt,
    };
  }

  // PUT /api/user/profile
  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.phone_number && { phoneNumber: dto.phone_number }),
        ...(dto.avatar_url !== undefined && { avatarUrl: dto.avatar_url }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return {
      message: 'Profil berhasil diupdate',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone_number: updated.phoneNumber,
        avatar_url: updated.avatarUrl,
        created_at: updated.createdAt,
      },
    };
  }

  // POST /api/user/logout — JWT stateless, cukup hapus token di sisi client
  logout() {
    return {
      message: 'Logout berhasil. Silakan hapus token di sisi aplikasi.',
    };
  }
}
