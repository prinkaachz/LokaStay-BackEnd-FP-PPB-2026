import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard) // semua endpoint butuh JWT
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // POST /api/favorites
  @Post()
  create(@Request() req, @Body() dto: CreateFavoriteDto) {
    return this.favoritesService.create(req.user.id, dto);
  }

  // DELETE /api/favorites/:id
  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.favoritesService.remove(req.user.id, id);
  }

  // GET /api/favorites
  @Get()
  findAll(@Request() req) {
    return this.favoritesService.findAll(req.user.id);
  }
}
