import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VillasModule } from './villas/villas.module';
import { FavoritesModule } from './favorites/favorites.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    VillasModule,
    FavoritesModule,
    BookingsModule,
    ReviewsModule,
    UsersModule,
    OnboardingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
