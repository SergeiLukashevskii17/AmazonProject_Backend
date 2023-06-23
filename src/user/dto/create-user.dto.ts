import {
  MinLength,
  IsString,
  IsInt,
  IsPhoneNumber,
  IsEmail
} from 'class-validator';

export class CreateUserDto {
  @IsInt()
  id: number;

  @MinLength(6, { message: 'password must be at least 6 character long' })
  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  avatarPath: string;

  @IsPhoneNumber()
  phone: string;
}
