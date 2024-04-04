import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"
import { Gender } from "src/Enum/general.enum"
import { Match } from "src/helpers/match.decorator"

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    fullname:string

    @IsNotEmpty()
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

    @IsDateString()
    @IsOptional()
    dob:string

    @IsEnum(Gender)
    @IsNotEmpty()
    gender:Gender


    


}

export class UpdateUserInfoDto{
    @IsString()
    @IsOptional()
    fullname:string

    @IsEmail()
    @IsOptional()
    email:string

    @IsString()
    @IsOptional()
    profilePicture:string


    @IsEnum(Gender)
    @IsOptional()
    gender:Gender

}






