import {
  Controller,
  Get,
  Post,
  Put,
  HttpCode,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAllReviews() {
    const reviews = await this.reviewService.getAll();

    return reviews;
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    const review = await this.reviewService.getById(Number(id));

    return review;
  }

  @Get('/avg/:productId')
  async getProductAvgRating(@Param('productId') productId: string) {
    const avgRating = await this.reviewService.getAvgRating(Number(productId));

    return avgRating;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async createReview(@CurrentUser('id') userId, @Body() dto: CreateReviewDto) {
    const review = await this.reviewService.create(userId, dto);

    return review;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put()
  async updateReview(@Body() dto: UpdateReviewDto) {
    const review = await this.reviewService.update(dto);

    return review;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Delete()
  async deleteReview(@Body('id') id: string) {
    const review = await this.reviewService.delete(Number(id));

    return review;
  }
}
