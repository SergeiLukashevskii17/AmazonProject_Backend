import {
  Controller,
  Get,
  Post,
  Put,
  HttpCode,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    const categories = await this.categoryService.getAll();

    return categories;
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    const category = await this.categoryService.getById(Number(id));

    return category;
  }

  @Get('slug/:slugName')
  async getCategoryBySlug(@Param('slugName') slugName: string) {
    const category = await this.categoryService.getBySlug(slugName);

    return category;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    const category = await this.categoryService.create(dto);

    return category;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put()
  async updateCategory(@Body() dto: UpdateCategoryDto) {
    const category = await this.categoryService.update(dto);

    return category;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Delete()
  async deleteCategory(@Body('id') id: string) {
    const category = await this.categoryService.delete(Number(id));

    return category;
  }
}
