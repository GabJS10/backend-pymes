import { Controller, Get, Post, Body, Patch, Param,   HttpCode,
  HttpStatus,UseInterceptors,  Request,
  UploadedFile,
  UploadedFiles} from '@nestjs/common';
import { UserBussinessService } from './user-bussiness.service';
import { CreateUserBussinessDto } from './dto/create-user-bussiness.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enum/Roles.enum';
import { UpdateUserBussinessDto } from './dto/update-user-bussiness.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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