import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Post } from "./post.model";
import { CreatePostDto } from "./dtos/create-post.dto";
import { FilesService } from "src/files/files.service";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private fileService: FilesService
  ) {}

  async create(dto: CreatePostDto, image: any) {
    const fileName = await this.fileService.createFile(image);
    const post = await this.postRepository.create({
      ...dto,
      image: fileName,
      userId: dto.userId,
    });

    return post;
  }
}
