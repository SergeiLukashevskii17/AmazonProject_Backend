import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

// задекомпозировать ( вынести логику связанную с юзером в юзер сервис , возможно добавить несколько новых приватных методов и использовать их (checkToken , например))
// вынести текст ошибок в отдельные константы

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: AuthDto) {
    const candidate = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (candidate) throw new BadRequestException('User already exists');

    const password = await hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: faker.person.fullName(),
        avatarPath: faker.image.avatar(),
        phone: faker.phone.number(),
        password
      }
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

    if (!user)
      throw new NotFoundException('User with this email does not exist ');

    const isPasswordValid = await verify(user.password, dto.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invaild password ');

    const tokens = await this.createTokens(user.id);

    return {
      user: this.getUserFields(user),
      ...tokens
    };
  }

  async getNewTokens(dto: RefreshTokenDto) {
    const { refreshToken } = dto;

    const parsedToken = await this.jwt.verifyAsync(refreshToken);

    if (!parsedToken) throw new UnauthorizedException('Invalid refresh token');

    const { id } = parsedToken;

    const user = await this.prisma.user.findUnique({ where: { id } });

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

  private getUserFields(user: CreateUserDto) {
    return {
      id: user.id,
      email: user.email
    };
  }
}
