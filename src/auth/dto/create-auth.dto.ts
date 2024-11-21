import { Transform } from "class-transformer";
import {  IsEmail, IsNumber, IsString,IsOptional } from "class-validator";
import { Role } from "../../common/enum/Roles.enum";


export class CreateAuthDto {

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    //default role is user
    @IsString()
    @IsOptional()
    roles?: Role[];
    

    @IsString()
    @Transform(({value}) => value.trim())
    password: string;

    @IsString()
    name_url: string;
    @IsString()
    holder: string;

    @IsString()
    whatsapp_contact: string;
    
    @IsString()
    locality: string;

    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
    shipping_cost: number;

    @IsString()
    contact_name: string;

    @IsString()
    number_contact: string;

    @IsString()
    @IsOptional()
    social_media_contact?: string;

}
