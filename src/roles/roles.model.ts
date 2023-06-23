import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/users.model";
import { UserRoles } from "./Roles-Users-Connection/user-roles.model";

interface RoleCreationAttributes {
  // описываем поля , необходимые для создания объекта типа n
  value: string;
  description: string;
}

@Table({ tableName: "roles" })
export class Role extends Model<Role, RoleCreationAttributes> {
  @ApiProperty({ example: "1", description: "id" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "ADMIN", description: "User`s role value" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  @ApiProperty({ example: "Администратор", description: "Role description" })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  // так как связи между пользователя и ролями - многие ко многим , то мы реализуем промежуточную таблицу , которая будет хранить информацию о том , какой пользователь какой ролью обладает

  // подобну запись нужно также указать в таблице Users

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
