import { IsString, IsPhoneNumber, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  avatarPath: string;

  @IsPhoneNumber()
  phone: string;
}
