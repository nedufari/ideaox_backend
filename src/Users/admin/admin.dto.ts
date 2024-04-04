import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"
import { Match } from "src/helpers/match.decorator"

export class CreateAdminDto{
    @IsString()
    fullname:string

    @IsEmail()
    email:string

    @IsStrongPassword({
        minLength:8,
        minLowercase:1,
        minNumbers:1,
        minSymbols:1,
        minUppercase:1
    })
    password:string 
    


}

export class UpdateAdminInfoDto{
    @IsString()
    @IsOptional()
    fullname:string

    @IsEmail()
    @IsOptional()
    email:string

    @IsString()
    @IsOptional()
    profilePicture:string

}




