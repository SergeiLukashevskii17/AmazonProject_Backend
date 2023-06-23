import {
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/Roles-Users-Connection/user-roles.model";
import { Post } from "src/posts/post.model";

interface UserCreationAttributes {
  email: string;
  password: string; // описываем поля , необходимые для создания объекта типа user
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttributes> {
  @ApiProperty({ example: "1", description: "id" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "anthona1995rus@mail.ru", description: "email" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: "qwerty", description: "password" })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: "true", description: "isBanned" })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @ApiProperty({ example: "typa po prikoly", description: "ban reason" })
  @Column({ type: DataType.STRING, allowNull: true })
  banReason: string;

  //промежуточная таблица является небохидмая , насколько я понимаю , когда у нас всязь один ко многим , в другом случае достаточно прописать @HasMany в моделе , которая имеют многие модели
  //@BelongsTo(() => Модель имеющая многие модели) fieldName:type в моделе , множество экземпляров которой , имеют другая модель

  @BelongsToMany(
    //связываем с
    () => Role,
    // по средствам
    () => UserRoles
  )
  roles: Role[];

  @HasMany(() => Post)
  posts: Post[];
}
