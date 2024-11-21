import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors,UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enum/Roles.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post() 
  @Auth([Role.USER_BUSSINESS])
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createProductDto: CreateProductDto,@UploadedFile() file ) {
    const fileUrl = `${process.env.BACKEND_URL}/uploads/${file.filename}`
    console.log(fileUrl);
    
    return this.productsService.create({
      ...createProductDto,
      image: fileUrl,
      user_bussiness_id: Number(createProductDto.user_bussiness_id)
      
    });
  }

  @Get('all/:id')
  findAll(@Param('id') user_bussiness_id: string) {

    console.log(user_bussiness_id);
    
    
    return this.productsService.findAll(parseInt(user_bussiness_id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
