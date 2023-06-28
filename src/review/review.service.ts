import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PrismaReturnReviewDto } from './dto/prisma-return-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaReturnUserDto } from 'src/user/dto/prisma-return-user.dto';
import { ProductService } from 'src/product/product.service';
import { DUBLICATE_REVIEW, NON_EXISTENT_REVIEW } from 'src/errors';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductService
  ) {}

  async getAll() {
    const reviews = await this.prisma.reviews.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: PrismaReturnReviewDto
    });
    return reviews;
  }

  async getById(id: number) {
    const review = await this.prisma.reviews.findUnique({
      where: {
        id
      },
      select: {
        ...PrismaReturnReviewDto,
        user: { select: PrismaReturnUserDto }
      }
    });

    if (!review) {
      throw new NotFoundException(NON_EXISTENT_REVIEW);
    }

    return review;
  }

  async create(userId: number, dto: CreateReviewDto) {
    const { productId, text, rating } = dto;

    await this.productService.getById(productId);

    // проверям , не оставлял ли пользователь отзыв для данного товара
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { reviews: { select: { productId: true } } }
    });
    const usersCurrentReviews = user.reviews;
    const reviewsIds = usersCurrentReviews.map(review => review.productId);

    if (reviewsIds.includes(productId))
      throw new BadRequestException(DUBLICATE_REVIEW);

    const review = await this.prisma.reviews.create({
      data: {
        text,
        rating,
        product: {
          connect: {
            id: productId
          }
        },
        user: {
          connect: {
            id: userId
          }
        }
      }
    });

    return review;
  }

  async update(dto: UpdateReviewDto) {
    await this.getById(dto.id);

    const review = await this.prisma.reviews.update({
      where: { id: dto.id },
      data: {
        rating: dto.rating,
        text: dto.text
      }
    });

    return review;
  }

  async delete(id: number) {
    await this.getById(id);

    const review = await this.prisma.reviews.delete({
      where: {
        id
      }
    });

    return review;
  }

  async getAvgRating(productId: number) {
    await this.productService.getById(productId);

    const avgRating = await this.prisma.reviews
      .aggregate({ where: { productId }, _avg: { rating: true } })
      .then(data => data._avg);

    return avgRating;
  }
}
