import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dtos/create-post.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("posts")
export class PostsController {
  constructor(private postSerivc: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image")) // необходимый декоратор для работы с файлами
  createPost(@Body() dto: CreatePostDto, @UploadedFile() image: any) {
    return this.postSerivc.create(dto, image);
  }
}
