import {
  Injectable,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PrismaReturnUserDto } from './dto/prisma-return-user.dto';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user-dto';
import { ToggleFavoriteAction } from './types/toggleFavorite';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';
import {
  DUBLICATE_EMAIL,
  DUBLICATE_PHONE,
  NON_EXISTENT_PRODUCT,
  NON_EXISTENT_USER,
  NO_USER_WITH_THIS_EMAIL,
  NO_USER_WITH_THIS_PHONE,
  PRODUCT_IS_FAVORITE,
  PRODUCT_IS_NOT_FAVORITE
} from 'src/errors';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductService
  ) {}

  async getById(id: number, additionalSelectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      select: {
        ...PrismaReturnUserDto,
        ...additionalSelectObject,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true
          }
        }
      }
    });

    if (!user) throw new BadRequestException(NON_EXISTENT_USER);

    return user;
  }

  async create(dto: CreateUserDto) {
    const { email, phone } = dto;

    const userWithCurrentEmail = await this.prisma.user.findUnique({
      where: { email }
    });

    if (userWithCurrentEmail)
      throw new BadRequestException(NO_USER_WITH_THIS_EMAIL);

    const userWithCurrentPhone = await this.prisma.user.findUnique({
      where: { phone }
    });

    if (userWithCurrentPhone)
      throw new BadRequestException(NO_USER_WITH_THIS_PHONE);

    const password = await hash(dto.password);

    const user = await this.prisma.user.create({
      data: { ...dto, password }
    });

    return user;
  }

  async update(userId: number, dto: UpdateUserDto) {
    const { email, name, avatarPath, phone } = dto;

    const userWithCurrentEmail = await this.prisma.user.findUnique({
      where: { email }
    });

    if (userWithCurrentEmail) throw new BadRequestException(DUBLICATE_EMAIL);

    const userWithCurrentPhone = await this.prisma.user.findUnique({
      where: { phone }
    });

    if (userWithCurrentPhone) throw new BadRequestException(DUBLICATE_PHONE);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { email, name, avatarPath, phone }
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatarPath: updatedUser.avatarPath,
      phone: updatedUser.phone
    };
  }

  async toggleFavorite(
    userId: number,
    productId: number,
    actionType: ToggleFavoriteAction
  ) {
    const user = await this.getById(userId);
    const product = await this.productService.getById(productId);

    if (!user) throw new NotFoundException(NON_EXISTENT_USER);
    if (!product) throw new NotFoundException(NON_EXISTENT_PRODUCT);

    const isProductAlreadyFavorite = user.favorites.some(
      product => product.id === productId
    );

    const needToAdd = actionType === ToggleFavoriteAction.Add;

    if (needToAdd && isProductAlreadyFavorite)
      throw new BadRequestException(PRODUCT_IS_FAVORITE);

    if (!needToAdd && !isProductAlreadyFavorite)
      throw new BadRequestException(PRODUCT_IS_NOT_FAVORITE);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        favorites: {
          [needToAdd ? 'connect' : 'disconnect']: {
            id: productId
          }
        }
      },
      select: {
        ...PrismaReturnUserDto,
        favorites: { select: { id: true, name: true } }
      }
    });

    return updatedUser;
  }
}
