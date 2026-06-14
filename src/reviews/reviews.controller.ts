import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // POST /api/reviews
  @Post()
  create(@Request() req, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, dto);
  }

  // GET /api/reviews/my — semua review yang pernah dibuat oleh user login
  @Get('my')
  findMyReviews(@Request() req) {
    return this.reviewsService.findMyReviews(req.user.id);
  }
}
