import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Auth } from './decorators/auth.decorator';
import { RequestWithUser } from 'src/common/interfaces/requestWithUser.interface';
import { Role } from '../common/enum/Roles.enum';
import { requestWithUser } from '../common/decorators/activeUser.decorator';
import { JwtService } from '@nestjs/jwt';
import { EXPIRED_TIME, jwtConstants } from './constants';
import { RefreshGuard } from './refresh/refresh.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Auth([Role.USER_CLIENT, Role.USER_BUSSINESS])
  @Get('profile')
  getProfile(@requestWithUser() req: RequestWithUser) {
    return req;
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req: RequestWithUser) {
    console.log(req.user);
    
    const token = await this.authService.getJwtToken({
      email: req.user.email,
      roles: req.user.roles,
      id: req.user.id,
    });

    return {
      token,
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRED_TIME),
    };
  }
}
