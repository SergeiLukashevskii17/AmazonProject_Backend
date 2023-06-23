import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const authHeader = request.headers.authorization;
      const tokenType = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];

      if (tokenType !== "Bearer" || !token) {
        throw new UnauthorizedException({ message: "Unauthorized" });
      }

      const userData = this.jwtService.verify(token);

      request.user = userData;
      return true; // если данная функция возвращает true, значит доступ к endpoint`y разрешён
    } catch (error) {
      throw new UnauthorizedException({ message: "Unauthorized" });
    }
  }
}
