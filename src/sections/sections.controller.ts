import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enum/Roles.enum';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @HttpCode(201)
  @Auth([Role.USER_BUSSINESS])
  create(@Body() section: CreateSectionDto,@Req() request: Request) {
    return this.sectionsService.create(section,request["user"].id);
  }


  @Post("assingProductsToSection")
  assingProductsToSection(@Body() { section_id,products_id,user_bussiness_id }: { section_id:number,products_id:number[],user_bussiness_id:number }) {
    console.log(section_id,products_id,user_bussiness_id);
    
    return this.sectionsService.assingProductsToSection(section_id,products_id,user_bussiness_id);
  }

  @Get()
  @HttpCode(200)
  @Auth([Role.USER_BUSSINESS])
  findAll(@Req() request: Request) {
    return this.sectionsService.findAll(parseInt(request["user"].id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(+id, updateSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(+id);
  }
}
