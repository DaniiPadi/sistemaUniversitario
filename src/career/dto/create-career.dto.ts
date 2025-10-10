import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateCareerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  duration: number;

  @IsNotEmpty()
  @IsInt()
  specialtyId: number;
}