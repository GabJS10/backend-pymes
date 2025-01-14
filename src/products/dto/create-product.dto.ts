import { IsString, IsNumber, IsArray,IsInt, IsOptional } from 'class-validator';

export class CreateProductDto {

    @IsString()
    name: string;

    @IsString()
    description: string;
    
    @IsNumber()  
    price: number;

    @IsArray()
    @IsInt({each: true})
    sections_id: number[];

    @IsInt()
    user_bussiness_id: number;

    @IsString()
    image: string;

}