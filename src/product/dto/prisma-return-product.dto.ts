import { Prisma } from '@prisma/client';
import { PrismaReturnCategoryDto } from 'src/category/dto/prisma-return-category.dto';
import { PrismaReturnReviewDto } from 'src/review/dto/prisma-return-review.dto';

export const PrismaReturnProductDto: Prisma.ProductSelect = {
  images: true,
  description: true,
  id: true,
  name: true,
  price: true,
  createdAt: true,
  slug: true
};

export const PrismaReturnProductFullDto: Prisma.ProductSelect = {
  ...PrismaReturnProductDto,
  reviews: {
    select: PrismaReturnReviewDto
  },
  category: { select: PrismaReturnCategoryDto }
};
