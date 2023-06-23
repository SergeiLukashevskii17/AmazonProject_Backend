import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, IsEmail } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "anthona1995rus@mail.ru", description: "email" })
  @IsString({ message: "Should be a string" })
  @IsEmail({}, { message: "Invalid email" })
  readonly email: string;
  @ApiProperty({ example: "qwerty", description: "password" })
  @IsString({ message: "Should be a string" })
  @Length(4, 16, {
    message: "Should have more than 4 and less than 16 symbols",
  })
  readonly password: string;
}
