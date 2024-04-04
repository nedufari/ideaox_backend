import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { LikeAction } from "src/Enum/general.enum";
import { Match } from "src/helpers/match.decorator";

export class ChangePassword{
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength:8,
        minLowercase:1,
        minNumbers:1,
        minSymbols:1,
        minUppercase:1
    })
    oldPassword:string

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength:8,
        minLowercase:1,
        minNumbers:1,
        minSymbols:1,
        minUppercase:1
    })
    newPassword :string

    @IsString()
    @IsNotEmpty()
    @Match('newPassword',{message:"confirmPassword does not match the newPassword "})
    confirmNewPassword :string
}

export class RequestOtpResendDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  }

  export class SendPasswordResetLinkDto{
    
    @IsString()
    @IsNotEmpty()
    email:string 

}

export class VerifyOtpDto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    otp:string
}

export class  FinallyResetPasswordDto{
    
    @IsString()
    @IsNotEmpty()
    email:string 

    @IsString()
    @IsNotEmpty()
    otp:string 

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength:8,
        minLowercase:1,
        minNumbers:1,
        minSymbols:1,
        minUppercase:1
    })
    password:string 

    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'ConfirmPassword does not match the new password.' })
    confirmPassword:string 

}


export class Logindto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    password:string

   
}

export class CommentDto{
    @IsString()
    @IsNotEmpty()
    comment:string

}



export class ReplyDto{
    @IsString()
    @IsNotEmpty()
    reply:string
    
}

export class LikeDto{
    @IsEnum(LikeAction)
    @IsNotEmpty()
    like:LikeAction
}

