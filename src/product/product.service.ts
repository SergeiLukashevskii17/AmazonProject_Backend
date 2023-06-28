import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  PrismaReturnProductDto,
  PrismaReturnProductFullDto
} from './dto/prisma-return-product.dto';
import { NON_EXISTENT_PRODUCT } from 'src/errors';
import { CreateProductDto } from './dto/create-product.dto';
import { generateSlug } from 'src/utils/generate-slug';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetAllProductDto, ProductSort } from './dto/get-all-products.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService
  ) {}

  async getAll(dto: GetAllProductDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    switch (sort) {
      case ProductSort.LOW_PRICE:
        prismaSort.push({ price: 'asc' });
      case ProductSort.HIGH_PRICE:
        prismaSort.push({ price: 'desc' });
      case ProductSort.OLDEST:
        prismaSort.push({ createdAt: 'asc' });
      case ProductSort.NEWEST:
        prismaSort.push({ createdAt: 'desc' });
    }

    const mode = 'insensitive'; // dont care about letters case

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode
                }
              }
            },
            {
              name: {
                contains: searchTerm,
                mode
              }
            },
            {
              description: { contains: searchTerm, mode }
            }
          ]
        }
      : {};

    const { perPage, skip } = this.paginationService.getPagination(dto);

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
      select: PrismaReturnProductDto
    });

    const total = await this.prisma.product.count({
      where: prismaSearchTermFilter
    });

    return { products, total };
  }

  async getById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: PrismaReturnProductFullDto
    });

    if (!product) throw new NotFoundException(NON_EXISTENT_PRODUCT);

    return product;
  }

  async getBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: PrismaReturnProductFullDto
    });

    if (!product) throw new NotFoundException(NON_EXISTENT_PRODUCT);

    return product;
  }

  // получаем список товаров с такой же категорией , не включая наш товар
  async getSimiliar(id: number) {
    const currentProduct = await this.getById(id);

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          slug: currentProduct.category.slug
        },
        NOT: {
          id: currentProduct.id
        }
      },
      select: PrismaReturnProductFullDto
    });

    if (!products.length) throw new NotFoundException(NON_EXISTENT_PRODUCT);

    return products;
  }

  async create(dto: CreateProductDto) {
    const { description, name, price, categoryId, images } = dto;

    const product = await this.prisma.product.create({
      data: {
        description,
        name,
        price,
        images,
        slug: generateSlug(name),
        category: { connect: { id: categoryId } }
      }
    });

    return product;
  }

  async update(dto: UpdateProductDto) {
    const { description, name, price, categoryId, images, id } = dto;

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        description,
        name,
        price,
        images,
        slug: generateSlug(name),
        category: { connect: { id: categoryId } }
      }
    });

    return product;
  }

  async delete(id: number) {
    const product = await this.prisma.product.delete({ where: { id } }); // FIX : тут как я понимаю не происходит удаление некоторых товаров из-за того , что опираясь на них уже созданы ревью
    return product;
  }
}