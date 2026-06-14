import { IsDateString, IsInt, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @Type(() => Number)
  @IsInt({ message: 'villa_id harus berupa angka' })
  @IsPositive()
  villa_id: number;

  @IsDateString({}, { message: 'check_in harus format YYYY-MM-DD' })
  check_in: string;

  @IsDateString({}, { message: 'check_out harus format YYYY-MM-DD' })
  check_out: string;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Jumlah tamu minimal 1 orang' })
  guest_count: number;
}
