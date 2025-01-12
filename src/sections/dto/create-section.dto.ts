import { IsString, IsInt,IsNotEmpty, IsArray, IsOptional } from "class-validator";


export class CreateSectionDto {

    @IsString()
    @IsNotEmpty()
    name: string



    @IsArray()
    @IsInt({each: true})
    @IsOptional()
    products_id: number[]




}
