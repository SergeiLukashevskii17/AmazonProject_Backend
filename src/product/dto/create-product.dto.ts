import { ArrayMinSize, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description?: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  images: string[];

  @IsNumber()
  categoryId: number;
}
