import { Prisma } from '@prisma/client';

export const PrismaReturnReviewDto: Prisma.ReviewsSelect = {
  id: true,
  rating: true,
  text: true,
  createdAt: true,
  updatedAt: true,
  productId: true
};
