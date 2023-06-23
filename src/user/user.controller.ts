import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  Patch,
  Param,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user-dto';
import { ToggleFavoriteAction } from './types/toggleFavorite';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth()
  async getUser(@CurrentUser('id') id: number) {
    return this.userService.getById(id);
  }

  @Put()
  @HttpCode(200)
  @Auth()
  @UsePipes(new ValidationPipe())
  async updateUser(@CurrentUser('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Patch('favorites/:productId')
  @HttpCode(200)
  @Auth()
  async toggleFavorite(
    @CurrentUser('id') id: number,
    @Param('productId') productId: string,
    @Body('actionType') actionType: ToggleFavoriteAction
  ) {
    return this.userService.toggleFavorite(id, Number(productId), actionType);
  }
}
