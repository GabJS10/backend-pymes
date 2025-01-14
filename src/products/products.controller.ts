import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors,UploadedFile, HttpStatus, HttpCode, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TransformProductDto } from './dto/transform-create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enum/Roles.enum';
import { Prisma } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post() 
  @Auth([Role.USER_BUSSINESS])
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createProductDto: TransformProductDto,@UploadedFile() file,@Req() request: Request) {
    

    
    const fileUrl = `${process.env.BACKEND_URL}/uploads/${file.filename}`
    
    console.log("createProductDto.sections_id",createProductDto);
    
    
    return this.productsService.create({
      ...createProductDto,
      image: fileUrl,
      user_bussiness_id: Number(request["user"].id),
      price: Number(createProductDto.price),
      sections_id: createProductDto.sections_id ? createProductDto.sections_id.split(',').map((id) => Number(id)) : []
    });
  }

  @Get('all/:id')
  findAll(@Param('id') user_bussiness_id: string) {

    
    
    return this.productsService.findAll(parseInt(user_bussiness_id));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([Role.USER_BUSSINESS])
  findOne(@Param('id') id: string,@Req() request: Request) {
    console.log("getProduct",id);
    
   return this.productsService.findOne(+id,request["user"].id);
  }

  @Post(':id') 
  @HttpCode(HttpStatus.OK)
  @Auth([Role.USER_BUSSINESS])
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string,@Req() request: Request, @Body() product: TransformProductDto,@UploadedFile() file) {
    
    const { sections_id,...p } = product;
    const sections = product.sections_id.split(',').map((id) => Number(id));


    return this.productsService.update(+id, {
      ...p,
      image: file ? `${process.env.BACKEND_URL}/uploads/${file.filename}` : product.image,
      price: Number(product.price),
    },sections,request["user"].id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([Role.USER_BUSSINESS])
  remove(@Param('id') id: string,@Req() request: Request) {
    console.log("deleteProduct",id);
    console.log("deleteProduct",request["user"].id);
    
    
    return this.productsService.remove(+id,request["user"].id);
  }
}
