import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  async getMane(userId: number) {
    const user = await this.userService.getById(userId, {
      orders: { select: { items: true } },
      reviews: true
    });

    // const query = `
    //   SELECT SUM(price) AS total_price
    //   FROM order_item
    //   WHERE order_id IN (
    //     SELECT id
    //     FROM "order"
    //     WHERE user_id = ${userId}
    //   )
    // `;

    return {
      orders: { count: user.orders.length },
      reviews: { count: user.reviews.length },
      favorites: { count: user.favorites.length },
      totalAmount:
        'Вот бы в этой конченой prisme написать кастомный sql запрос ...'
    };
  }
}
