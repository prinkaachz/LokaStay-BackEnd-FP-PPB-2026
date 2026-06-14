import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @Type(() => Number)
  @IsInt()
  villa_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Rating minimal 1' })
  @Max(5, { message: 'Rating maksimal 5' })
  rating: number;

  @IsString()
  @IsNotEmpty({ message: 'Komentar tidak boleh kosong' })
  comment: string;
}
