import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCareerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  duration: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  specialtyId: number;
}
