import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class ProductsService {

  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {

    const { sections_id,...productData } = createProductDto;
  
    try {

      const product = await this.prisma.product.create({
        data: {
          ...productData,
          price: new Prisma.Decimal(createProductDto.price),
          sections: {
            create: sections_id.map((id) => {
              return {
                section: { connect: { id } },
                user_bussiness: { connect: { id: createProductDto.user_bussiness_id }}
            }})
          }
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
        products: {
          include:{
            sections: {
              include: {
                section:{
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
    })


    return {
      products: data.products
    }
  }

  async findOne(id: number, user_bussiness_id: number) {
   try {

    const product = await this.prisma.product.findUnique({
      where: { id, user_bussiness_id },
      include: {
        sections: {
          include: {
            section: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
      
    
      return product;

   } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
   }
  }

  async update(id: number, updateProductDto: UpdateProductDto,sections_id:number[], user_bussiness_id: number) {
    

    try {
      const product = this.prisma.product.update({
        where: { id },
        data: {
          ...updateProductDto,
          user_bussiness_id
        },
      });
      

      if (sections_id.length > 0) {

        await this.prisma.productsOnSections.deleteMany({
          where: {
            product_id: id
          }
        })

        await this.prisma.productsOnSections.createMany({
          data: sections_id.map((id_section) => {
            return {
              product_id: id,
              section_id: id_section,
              user_bussiness_id
            }
          })
        })
        
      }

      
      return product;




    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number,user_bussiness_id: number) {
    try {
       return await this.prisma.product.delete({
        where: { 
          id,
          user_bussiness_id
         },
      });

    } catch (error) {
      console.log(error);
      
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
