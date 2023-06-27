import {
  MinLength,
  IsString,
  IsPhoneNumber,
  IsEmail,
  IsOptional
} from 'class-validator';

export class CreateUserDto {
  @MinLength(6, { message: 'password must be at least 6 character long' })
  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatarPath: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;
}
