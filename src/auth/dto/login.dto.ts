import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string; // si luego quieres login con username, lo cambiamos

  @IsString()
  @MinLength(6)
  password: string;
}
