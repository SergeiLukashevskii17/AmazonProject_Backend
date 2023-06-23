import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "./roles-auth.decorator";
import { CreateRoleDto } from "src/roles/dto/create-role.dto";

// работа в связке с roles-auth.decorator

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      // роли , пользователи имеющие которые , могут использовать n-ый endpoint
      const permissibleRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()]
      );

      if (!permissibleRoles) {
        return true;
      }

      const authHeader = request.headers.authorization;
      const tokenType = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];

      if (tokenType !== "Bearer" || !token) {
        throw new UnauthorizedException({ message: "Unauthorized" });
      }

      const userData: {
        roles: CreateRoleDto[];
      } | null = this.jwtService.verify(token);

      request.user = userData;

      // тут проверям , если юзер имеет одну из перечня требуемых ролей , то возвращает true ( разрешаем пользователю использовать endpoint)

      return userData.roles.some((role) =>
        permissibleRoles.includes(role.value)
      );
    } catch (error) {
      console.log(error);
      throw new HttpException("forbidden", HttpStatus.FORBIDDEN);
    }
  }
}
