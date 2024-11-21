import { Injectable } from '@nestjs/common';
import { CreateUserBussinessDto } from './dto/create-user-bussiness.dto';
import { PrismaService } from 'src/prisma.service';
import { User_bussiness } from '@prisma/client';
import { UpdateUserBussinessDto } from './dto/update-user-bussiness.dto';
@Injectable()
export class UserBussinessService {
 
 
 constructor(private prisma: PrismaService) {}



 getImageProfile(id: number) {
  try {
    return this.prisma.user_bussiness.findUnique({ where: { id }, select: { image_profile: true } });
    
  } catch (error) {
    
    console.log(error);
    return error
  }


  
}

getWhatsappContact(id: number) {
  try {
    return this.prisma.user_bussiness.findUnique({ where: { id }, select: { whatsapp_contact: true } });
  } catch (error) {
    
    console.log(error);
    return error
  }
}

getShippingCost(id: number) {
  try {
    return this.prisma.user_bussiness.findUnique({ where: { id }, select: { shipping_cost: true } });
    
  } catch (error) {
    
    console.log(error);
    return error
  }
}


  async create(createUserBussines: CreateUserBussinessDto) {
    /*
      example of json data to create user bussines

      {
        "name": "string",
        "email": "string",
        "password": "string",
        "name_url": "string",
        "holder": "string",
        "whatsapp_contact": "string",
        "locality": "string",
        "shipping_cost": 0,
        "contact_name": "string",
        "number_contact": "string",
        "social_media_contact": "string"
      }
        
    */


    return await this.prisma.user_bussiness.create({ data: createUserBussines });

    
  }

  async getAll() {

   const select = {
      id: true,
      name: true,
      email: true,
      roles: true,
      name_url: true,
      holder: true,
      whatsapp_contact: true,
      locality: true,
      shipping_cost: true,
      contact_name: true,
      number_contact: true,
      social_media_contact: true,
      category: true,
      description: true,
      close_hours: true,
      open_hours: true,
      rating: true,
      delivery_time: true,
      image_profile: true,
      image_cover: true,
    }
    
    return this.prisma.user_bussiness.findMany(
      { select }
    );
  }


  async getOne(id: number) {

    const select = {
      id: true,
      name: true,
      email: true,
      roles: true,
      name_url: true,
      holder: true,
      whatsapp_contact: true,
      locality: true,
      shipping_cost: true,
      contact_name: true,
      number_contact: true,
      social_media_contact: true,
      category: true,
      description: true,
      close_hours: true,
      open_hours: true,
      rating: true,
      delivery_time: true,
      image_profile: true,
      image_cover: true,
    }

    return this.prisma.user_bussiness.findUnique({ where: { id }, select });
  }

  async update(id: number, updateUserBussines: UpdateUserBussinessDto) {
    console.log(updateUserBussines);
    
    return this.prisma.user_bussiness.update({ where: { id }, data: updateUserBussines });
  }


  findByEmail(email: string) {
    return this.prisma.user_bussiness.findUnique({ where: { email } });
  }


}
