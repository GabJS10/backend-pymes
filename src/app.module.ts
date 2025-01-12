import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserBussinessModule } from './user-bussiness/user-bussiness.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SectionsModule } from './sections/sections.module';
@Module({
  imports: [UserBussinessModule, AuthModule, ProductsModule, SectionsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
