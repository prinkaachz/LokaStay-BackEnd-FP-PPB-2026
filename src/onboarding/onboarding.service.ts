import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  // GET /api/onboarding
  findAll() {
    return this.prisma.onboarding.findMany({
      orderBy: { stepOrder: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        stepOrder: true,
      },
    });
  }
}
