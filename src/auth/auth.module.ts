import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserBussinessService } from 'src/user-bussiness/user-bussiness.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserBussinessService,PrismaService],
})
export class AuthModule {}
