import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { generateSlug } from 'src/utils/generate-slug';
import { PrismaReturnCategoryDto } from './dto/prisma-return-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { NON_EXISTENT_CATEGORY } from 'src/errors';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const categories = await this.prisma.category.findMany({
      select: PrismaReturnCategoryDto
    });
    return categories;
  }

  async getById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id
      },
      select: PrismaReturnCategoryDto
    });

    if (!category) {
      throw new NotFoundException(NON_EXISTENT_CATEGORY);
    }

    return category;
  }

  async getBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        slug
      },
      select: PrismaReturnCategoryDto
    });

    if (!category) {
      throw new NotFoundException(NON_EXISTENT_CATEGORY);
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug: generateSlug(dto.name)
      }
    });

    return category;
  }

  async update(dto: UpdateCategoryDto) {
    await this.getById(dto.id); // чекаем , существует ли данная категория , если нет - выбрасываем ошибку

    const category = await this.prisma.category.update({
      where: {
        id: dto.id
      },
      data: {
        name: dto.name,
        slug: generateSlug(dto.name)
      }
    });

    return category;
  }

  async delete(id: number) {
    await this.getById(id);

    const category = await this.prisma.category.delete({
      where: {
        id
      }
    });

    return category;
  }
}
