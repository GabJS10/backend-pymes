import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserBussinessDto } from './dto/create-user-bussiness.dto';
import { PrismaService } from 'src/prisma.service';
import { User_bussiness } from '@prisma/client';
import { UpdateUserBussinessDto } from './dto/update-user-bussiness.dto';
@Injectable()
export class UserBussinessService {

 
 
 constructor(private prisma: PrismaService) {}



 /*
 
 metodo que actualizara el rating de un usuario bussiness: recibira el id del usuario bussiness,
 el rating que se le asignara y el id del usuario que lo asigna



 primero buscara si hay un registro en la tabla rating con el id del usuario bussiness y 
 el id del usuario

  si existe actualizara el rating del usuario bussiness

  si no existe creara un nuevo registro en la tabla rating con el id del usuario bussiness,
  el rating que se le asignara y el id del usuario que lo asigna


  luego actualizara el campo qualification del usuario bussiness con el nuevo rating

  (qualification es el promedio de todos los rating que se le han asignado al usuario bussiness)

 */


  /*

  Metodo para buscar registros segun la query que se le pase
  se usara el metodo contains de prisma

  */


  async search(query: string) {

    try {
      const search = await this.prisma.user_bussiness.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive"
              }
            },
            {
              category: {
                contains: query,
                mode: "insensitive"
              }
            },
            {
              description: {
                contains: query,
                mode: "insensitive"
              }
            },
            {
              sections:{
                some: {
                  section: {
                    name: {
                      contains: query,
                      mode: "insensitive"
                    }
                  }
                }
              }
            }
          ],
        },
      })


      return search;
    } catch (error) {
      console.log("error de search", error);
      
      return error;
    }
  }


  async getRating(user_bussiness_id: number, user_id: string) {
      
      const rating = await this.prisma.rating.findUnique({ where: { user_user_bussiness_id:{
        user_bussiness_id: user_bussiness_id,
        user: user_id
      }} });


      console.log(rating);
      

      return {
        qualification: rating ? rating.rating : 1
      }
  }

  async updateRating(id: number, rating: number, user_id: string) {
    try {

      if (rating < 1 || rating > 5) {
        throw new HttpException("Rating must be between 0 and 5", 400);
        
      }

      const ratingData = await this.prisma.rating.findUnique({ where: 
        {user_user_bussiness_id:{
          user_bussiness_id: id,
          user: user_id
        }}
      
      });
  
      if (ratingData) {
        await this.prisma.rating.update({ where: { user_user_bussiness_id:{
          user_bussiness_id: id,
          user: user_id
        } }, data: { rating } });
      } else {
        await this.prisma.rating.create({ data: { rating, user:user_id, user_bussiness_id: id } });
      }
  
      
      const ratingAvg = await this.prisma.rating.aggregate({
          _avg: {
            rating: true,
          },
        where: { user_bussiness_id: id },
        });

        const storeQualificationUpdate = await this.prisma.user_bussiness.update({
          
          where: { id },
          data: { qualification: Math.round(ratingAvg._avg.rating) },
        });
      return  storeQualificationUpdate
    } catch (error) {
      return error;
    }
  }




  

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
      qualification: true,
    }
    
    return this.prisma.user_bussiness.findMany(
      { select }
    );
  }


  async getOne(id: number) {

    try {
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
  
      const data = await this.prisma.user_bussiness.findUnique(
        {
           where: { id },
          include: {
  
            sections: {
              distinct: ["section_id"],
              include:{
                section: {
                  select:{
                    name: true
                  }
                }
              }
            }
          }
        }
        );
  
        data["password"] = "hidden";
        return data
    } catch (error) {
      throw new HttpException("User bussines not found", 404);
    }
  }

  async update(id: number, updateUserBussines: UpdateUserBussinessDto) {
    console.log(updateUserBussines);
    
    return this.prisma.user_bussiness.update({ where: { id }, data: updateUserBussines });
  }


  findByEmail(email: string) {
    return this.prisma.user_bussiness.findUnique({ where: { email } });
  }


}
