import { IsEmail, MinLength, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'password must be at least 6 character long' })
  @IsString()
  password: string;
}
