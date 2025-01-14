import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { CreateAuthDto } from './dto/create-auth.dto';
import { Role } from 'src/common/enum/Roles.enum';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserBussinessService } from 'src/user-bussiness/user-bussiness.service';
import * as bcrypt from 'bcrypt';
import { $Enums, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants,EXPIRED_TIME } from './constants';
@Injectable()
export class AuthService {
  constructor(
    private readonly userBussinessService: UserBussinessService,
    private readonly jwtService: JwtService,
  ) {}

  async getJwtToken(payload: { id: Number; email: string; roles: Role[] }) {
    return await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '1h',
    });
  }

  async getRefreshJwtToken(payload: { email: string; roles: Role[] }) {
    return await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secretRefresh,
      expiresIn: '2h',
    });
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userBussinessService.findByEmail(
      loginAuthDto.email,
    );

    if (!user) {
      throw new HttpException(
        'Credenciales incorrectas:email',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);

    if (!isMatch) {
      throw new HttpException(
        'Credenciales incorrectas:password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { email: user.email, roles: user.roles as Role[], id: user.id };
    const token = await this.getJwtToken(payload);
    const refreshToken = await this.getRefreshJwtToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        userName: user.name,
        roles: user.roles,
      },
      backendTokens:{
      token,
      refreshToken,
      },
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRED_TIME)
    };
  }

  async register(createAuthDto: CreateAuthDto) {
    console.log(createAuthDto);
    
    const user = await this.userBussinessService.findByEmail(
      createAuthDto.email,
    );
    
    if (user) {
      throw new ConflictException('El email o url ya se encuentra registrado');
    }
    
    try {
      

      const password = await bcrypt.hash(createAuthDto.password, 10);

      const roles = createAuthDto.roles || [Role.USER_BUSSINESS];

      await this.userBussinessService.create({
        ...createAuthDto,
        password,
        social_media_contact: createAuthDto.social_media_contact || '',
        shipping_cost: new Prisma.Decimal(createAuthDto.shipping_cost),
        roles: roles,
        image_cover:null,
        image_profile:null,
        category:null,
        description:null,
        open_hours:null,
        close_hours:null,
        qualification:1,
        delivery_time:null
      });

      return {
        message: 'Usuario registrado',
      };
    } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {

      if (error.code === 'P2002') {
        throw new ConflictException(
          'Error al registrar usuario: el email o url ya se encuentra registrado',
        );
      }
      
    }

    console.log(error);
    
      
      throw new HttpException(
        'Error al registrar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
