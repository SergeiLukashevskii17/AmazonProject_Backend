import { Module, forwardRef } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users.model";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/Roles-Users-Connection/user-roles.model";
import { RolesModule } from "src/roles/roles.module";
import { AuthModule } from "src/auth/auth.module";
import { Post } from "src/posts/post.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles, Post]),
    // понадобился RoleSerivce внутри userService , при этом чтобы получить service вместе с модулем нужно в его файле ( модуля ) указать export servic`a
    // почему нельзя просто здесь впихнуть rolesSerivce в провайдеры - хз ,
    RolesModule,
    forwardRef(() => AuthModule), // fwREf используются в обоих модулях  для фикса ошибки кольцевой зависимости ( мол вот у нас каждый из модулей использует другой)
  ],
  exports: [UsersService],
})
export class UsersModule {}
