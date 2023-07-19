import {
  Controller,
  UsePipes,
  ValidationPipe,
  Query,
  Get,
  Param,
  HttpCode,
  Post,
  Put,
  Delete,
  Body
} from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductDto } from './dto/get-all-products.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDto: GetAllProductDto) {
    return this.productService.getAll(queryDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productService.getById(Number(id));
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productService.getBySlug(slug);
  }

  @Get('category/:id')
  async getByCategory(@Param('id') id: string) {
    return this.productService.getByCategory(Number(id));
  }

  @Get('similiar/:id')
  async getSimiliar(@Param('id') id: string) {
    return this.productService.getSimiliar(Number(id));
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put()
  async update(@Body() dto: UpdateProductDto) {
    return this.productService.update(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Delete()
  async delete(@Body('id') id: number) {
    return this.productService.delete(id);
  }
}
