import { Transform } from "class-transformer"
import { IsEmail, IsString } from "class-validator"

export class LoginAuthDto {

    @IsEmail()
    email: string

   @IsString()
   @Transform(({value}) => value.trim()) 
    password: string


}
