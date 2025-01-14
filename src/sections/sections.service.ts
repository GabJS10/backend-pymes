import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class SectionsService {

  constructor(private prisma: PrismaService) {}


  create(createSectionDto: CreateSectionDto,user_bussiness_id:number) {
    try {
      console.log(createSectionDto.products_id);
      
      return this.prisma.section.create({
        data: {
          name: createSectionDto.name,
          user_bussiness: { connect: { id: user_bussiness_id } },
          products: {
            create: createSectionDto.products_id ? createSectionDto.products_id.map((id) => {
              return {
              product:{connect:{id}},
              user_bussiness:{connect:{id:user_bussiness_id}}
              }
            }) : []
          }
        }
      })
    } catch (error) {
      
      
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }



  assingProductsToSection(section_id:number,products_id:number[],user_bussiness_id:number){ 
    try {
      return this.prisma.productsOnSections.createMany({
        data: products_id.map((id) => {
          return {
            product_id: id,
            section_id: section_id,
            user_bussiness_id
          }
        })
      })
      
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async findAll(user_bussiness_id:number) {
    const sections = await this.prisma.section.findMany(
      {
        where:{
          user_bussiness_id
        },
      }
    );

    return sections
  }


  update(id: number, updateSectionDto: UpdateSectionDto) {
    return this.prisma.section.update({where:{id},data:updateSectionDto});
  }

  remove(id: number) {
    return this.prisma.section.delete({where:{id}});
  }
}
