import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './dto/create-order.dto';
import { NON_EXISTENT_PRODUCT_OR_PRODUCTS } from 'src/errors';
import { PrismaReturnProductDto } from 'src/product/dto/prisma-return-product.dto';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        items: { include: { product: { select: PrismaReturnProductDto } } }
      }
    });
  }

  async placeOrder(dto: OrderDto, userId: number) {
    const promises = dto.items.map(async ({ productId }) => {
      const product = await this.prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product)
        throw new NotFoundException(NON_EXISTENT_PRODUCT_OR_PRODUCTS);
    });

    await Promise.all(promises);

    const total = dto.items.reduce(
      (acc, { price, quantity }) => acc + price * quantity,
      0
    );

    const order = await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: dto.items
        },
        total,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });

    this.useStripe();

    let payment;

    return { payment };
  }

  private async useStripe() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15'
    });

    const customer = await stripe.customers.create({
      email: 'jy6c3twfdsfsdfds@gmail.com'
    });

    console.log('C U S T O M E R ', customer);
  }
}
