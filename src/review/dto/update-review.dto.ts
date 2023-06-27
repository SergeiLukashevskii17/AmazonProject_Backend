import { IsNumber, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  text: string;
}
