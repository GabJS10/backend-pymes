import { IsString, IsNumber, IsArray,IsInt, IsOptional } from 'class-validator';

export class TransformProductDto {

    @IsString()
    name: string;

    @IsString()
    description: string;
    
    @IsString()
    price: string;

    @IsString()
    sections_id: string;

    @IsString()
    @IsOptional()
    image: string;



}