import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserService } from 'src/user/user.service';
import {
  INVALID_PASSWORD,
  INVALID_REFRESH_TOKEN,
  NO_USER_WITH_THIS_EMAIL
} from 'src/errors';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private userService: UserService
  ) {}

  async register(dto: AuthDto) {
    const user = await this.userService.create({
      email: dto.email,
      password: dto.password,
      name: faker.person.fullName(),
      avatarPath: faker.image.avatar(),
      phone: faker.phone.number()
    });

    const tokens = await this.createTokens(user.id);

    return {
      user: this.getUserFields(user),
      ...tokens
    };
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (!user) throw new NotFoundException(NO_USER_WITH_THIS_EMAIL);

    const isPasswordValid = await verify(user.password, dto.password);

    if (!isPasswordValid) throw new UnauthorizedException(INVALID_PASSWORD);

    const tokens = await this.createTokens(user.id);

    return {
      user: this.getUserFields(user),
      ...tokens
    };
  }

  async getNewTokens(dto: RefreshTokenDto) {
    const parsedToken = await this.checkToken(dto);

    const { id } = parsedToken;
    const user = await this.userService.getById(id);
    const tokens = await this.createTokens(user.id);

    return {
      user: this.getUserFields(user),
      ...tokens
    };
  }

  private async createTokens(userId: number) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '15m'
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d'
    });

    return { accessToken, refreshToken };
  }

  private async checkToken(dto: RefreshTokenDto) {
    const { refreshToken } = dto;

    const parsedToken = await this.jwt.verifyAsync(refreshToken);

    if (!parsedToken) throw new UnauthorizedException(INVALID_REFRESH_TOKEN);

    return parsedToken;
  }

  private getUserFields(user: { [key: string]: any }) {
    return {
      id: user.id,
      email: user.email
    };
  }
}
