import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './dto/create-order.dto';
import { NON_EXISTENT_PRODUCT_OR_PRODUCTS } from 'src/errors';
import { PrismaReturnProductDto } from 'src/product/dto/prisma-return-product.dto';
import * as YooKassa from 'yookassa';

const yooKassa = new YooKassa({
  shopId: process.env.SHOP_ID,
  secretKey: process.env.PAYMENT_TOKEN
});
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

    const payment = await yooKassa.createPayment({
      amount: {
        value: total.toFixed(2),
        currency: 'RUB'
      },
      payment_method_data: {
        type: 'bank-card'
      },
      confirmation: {
        type: 'redirect',
        return_url: 'http://localhost:3000/thanks'
      },
      description: `Order #${order.id}`
    });

    return payment;
  }
}
