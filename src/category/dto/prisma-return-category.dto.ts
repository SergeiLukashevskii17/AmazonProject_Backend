import { Prisma } from '@prisma/client';

export const PrismaReturnCategoryDto: Prisma.CategorySelect = {
  id: true,
  name: true,
  slug: true
};
