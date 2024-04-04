import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { IdeaTags } from "src/Enum/general.enum";

export class MakeblogPostDto{
    @IsString()
    @IsNotEmpty()
    idea:string

    @IsEnum(IdeaTags)
    @IsNotEmpty()
    tag:IdeaTags

    @IsArray()
    @IsOptional()
    media:string[]
}


export class EditblogPostDto{
    @IsString()
    @IsOptional()
    @MaxLength(2000)
    @MinLength(20)
    idea:string

    @IsEnum(IdeaTags)
    @IsOptional()
    tag:IdeaTags


    @IsArray()
    @IsOptional()
    media:string[]
}

