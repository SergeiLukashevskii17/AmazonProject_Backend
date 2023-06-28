import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  imports: [ProductModule],
  exports: [UserService]
})
export class UserModule {}
