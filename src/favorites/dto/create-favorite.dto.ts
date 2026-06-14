import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFavoriteDto {
  @Type(() => Number)
  @IsInt({ message: 'villa_id harus berupa angka' })
  @IsPositive({ message: 'villa_id harus positif' })
  villa_id: number;
}
