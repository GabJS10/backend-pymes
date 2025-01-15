import { Controller, Get, Post, Body, Patch, Param,   HttpCode,
  HttpStatus,UseInterceptors,  Request,
  UploadedFile,
  UploadedFiles,
  Req} from '@nestjs/common';
  import { Request as RequestExpress} from 'express';
import { UserBussinessService } from './user-bussiness.service';
import { CreateUserBussinessDto } from './dto/create-user-bussiness.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enum/Roles.enum';
import { UpdateUserBussinessDto } from './dto/update-user-bussiness.dto';
import {  FilesInterceptor } from '@nestjs/platform-express';
@Controller('user-bussiness')
export class UserBussinessController {
  constructor(private readonly userBussinessService: UserBussinessService) {}

  @Post()
  create(@Body() createUserBussinessDto: CreateUserBussinessDto) {

    

    return "create"
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    
    return this.userBussinessService.getOne(parseInt(id));
  }


  @Get()
  findAll() {
    return this.userBussinessService.getAll();
  }
  

/*

  Metodo para buscar registros segun la query que se le pase
  se usara el metodo contains de prisma

  */


  @Get("search/:query")
  @HttpCode(HttpStatus.OK)
  async search(@Param("query") query: string) {
    return this.userBussinessService.search(query);
  }

 


/*
  endpoint para obtener el rating que un usuario asigno a un usuario bussiness
  parametros de la funcion: user_id y user_bussiness_id
*/


@Get("rating/:id")
  @HttpCode(HttpStatus.OK)
  async getRating(@Param("id") id: string, @Req() request: RequestExpress) {
    console.log(request.cookies["user_id"]);
    
    return this.userBussinessService.getRating(parseInt(id), request.cookies["user_id"]);
  }


   /*

  crear un endpoint para cuando se actualice el rating de un usuario bussiness
   y a la vez creara un registro en la tabla rating
   recibira el id del usuario bussiness y el rating que se le asignara y el id 
   del usuario que lo asigna

  
  */
@Patch("updateRating/:id")
@HttpCode(HttpStatus.OK)
async updateRating(@Param("id") id: string, @Req() request: RequestExpress,@Body() body: { rating: number }) {
  console.log("probando",request.cookies["user_id"],parseInt(id),body.rating);

  
  
  return this.userBussinessService.updateRating(parseInt(id), body.rating, request.cookies["user_id"]);
}

  @Patch(":id")
  @Auth([Role.USER_BUSSINESS])
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images'))  
  async update(
    @Param("id") id: string,
    @Body() updateUserBussinessDto: UpdateUserBussinessDto,
    @UploadedFiles  () file?: Express.Multer.File[], 
  ) {

    

    if (file) {
      
      const filesUrl = file.map((file) => {
        return `${process.env.BACKEND_URL}/uploads/${file.filename}`
      });

      

      if (updateUserBussinessDto.image_profile === "" && updateUserBussinessDto.image_cover === "") {
        
        updateUserBussinessDto.image_profile = filesUrl[0];
        updateUserBussinessDto.image_cover = filesUrl[1];

      }else if(updateUserBussinessDto.image_profile === ""){
        
        updateUserBussinessDto.image_profile = filesUrl[0];
      }else if(updateUserBussinessDto.image_cover === ""){
        updateUserBussinessDto.image_cover = filesUrl[0];
      }
    }

    
    delete updateUserBussinessDto["images"];

    return this.userBussinessService.update(parseInt(id), updateUserBussinessDto);

  }

  @Get("imageProfile/:id")
  @Auth([Role.USER_BUSSINESS])
  @HttpCode(HttpStatus.OK)
  async getImageProfile(@Param("id") id: string, @Request() req) {
    
    return this.userBussinessService.getImageProfile(parseInt(id));
  }

  @Get("shippingCost/:id")
  @HttpCode(HttpStatus.OK)
  async getShippingCost(@Param("id") id: string) {
    
    return this.userBussinessService.getShippingCost(parseInt(id));
  }

  @Get("whatsapp/:id")
  @HttpCode(HttpStatus.OK)
  async getWhatsappContact(@Param("id") id: string) {
    
    return this.userBussinessService.getWhatsappContact(parseInt(id));
  }


}