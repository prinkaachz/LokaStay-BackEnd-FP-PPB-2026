import { Module } from '@nestjs/common';
import { VillasController } from './villas.controller';
import { VillasService } from './villas.service';

@Module({
  controllers: [VillasController],
  providers: [VillasService],
})
export class VillasModule {}
