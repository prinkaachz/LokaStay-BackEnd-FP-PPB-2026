import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { VillasService } from './villas.service';
import { SearchVillaDto } from './dto/search-villa.dto';

@Controller('villas')
export class VillasController {
  constructor(private readonly villasService: VillasService) {}

  // GET /api/villas
  @Get()
  findAll() {
    return this.villasService.findAll();
  }

  // ⚠️ PENTING: 'search' route HARUS sebelum ':id' agar tidak bentrok!
  // GET /api/villas/search?location=Bali
  @Get('search')
  search(@Query() dto: SearchVillaDto) {
    return this.villasService.search(dto);
  }

  // GET /api/villas/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.villasService.findOne(id);
  }
}
