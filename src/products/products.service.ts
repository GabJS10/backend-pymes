import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class ProductsService {

  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {

      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          price: new Prisma.Decimal(createProductDto.price),
        },
      })
      
      return {
        success: true,
        data: product
      };
      
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(user_bussiness_id: number) {

    
    const data = await this.prisma.user_bussiness.findUnique({
      where: {
        id: user_bussiness_id
      },
      include: {
        products: true
      },
    })

    return {
      products: data.products
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
