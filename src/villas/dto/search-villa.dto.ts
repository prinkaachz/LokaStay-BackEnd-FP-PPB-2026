import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchVillaDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  check_in?: string;

  @IsOptional()
  @IsDateString()
  check_out?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  guest_count?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  min_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  max_price?: number;
}
