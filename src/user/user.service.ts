import {
  Injectable,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { prismaReturnUserDto } from './dto/prisma-return-user.dto';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user-dto';
import { ToggleFavoriteAction } from './types/toggleFavorite';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getById(id: number, additionalSelectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      select: {
        ...prismaReturnUserDto,
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

    if (!user) throw new BadRequestException('User is not found');

    return user;
  }

  async update(userId: number, dto: UpdateUserDto) {
    const { email, name, avatarPath, phone } = dto;

    const userWithCurrentEmail = await this.prisma.user.findUnique({
      where: { email }
    });

    if (userWithCurrentEmail)
      throw new BadRequestException('User with current email already exist');

    const userWithCurrentPhone = await this.prisma.user.findUnique({
      where: { phone }
    });

    if (userWithCurrentPhone)
      throw new BadRequestException(
        'User with current phone number already exist'
      );

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
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!user) throw new NotFoundException('User not found');
    if (!product) throw new NotFoundException('Product not found');

    const isProductAlreadyFavorite = user.favorites.some(
      product => product.id === productId
    );

    const needToAdd = actionType === ToggleFavoriteAction.Add;

    if (needToAdd && isProductAlreadyFavorite)
      throw new BadRequestException('this product is already a favorite ');

    if (!needToAdd && !isProductAlreadyFavorite)
      throw new BadRequestException('this product is not favorite ');

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        favorites: {
          [needToAdd ? 'connect' : 'disconnect']: {
            id: productId
          }
        }
      }
    });

    return updatedUser;
  }
}
