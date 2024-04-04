import { Controller,Post,Patch,Body, Req,Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./user.dto";
import { FinallyResetPasswordDto, Logindto, RequestOtpResendDto, SendPasswordResetLinkDto, VerifyOtpDto } from "src/common/common.dto";
import { JwtGuard } from "src/auth/guard/jwt.guard";

@Controller('user')
export class UserController{
    adminservice: any;
    constructor(private readonly userservice:UserService){}


    @UseGuards(JwtGuard)
    @Get('profile')
    async getProfile(@Req() req: any): Promise<any> {
      const userId = req.user.id;
      // Call the service to get user profile
      return this.userservice.getProfile(userId);
    }

    @Post('/register')
    async Registeradmin(@Body()dto:CreateUserDto):Promise<{message:string}>{
        return await this.userservice.createUser(dto)
    }

    @Post('/verify-email')
    async Verify_email(@Body()dto:VerifyOtpDto):Promise<{isValid:boolean; accessToken:any}>{
        return await this.userservice.verifyEmail(dto)
    }

 

    @Post('/resend-verification-link')
    async resendVerificationLink(@Body()dto:RequestOtpResendDto):Promise<{message:string}>{
        return await this.userservice.ResendExpiredOtp(dto)

    }

    @Post('/send-password-reset-link')
    async sendPasswordResetLink (@Body()dto:SendPasswordResetLinkDto):Promise<{message:string}>{
        return await this.userservice.sendPasswordResetLink(dto)
    }

    @Patch('/reset-password')
    async ResetPassword(@Body()dto:FinallyResetPasswordDto):Promise<{message:string}>{
        return await this.userservice.finallyResetPassword(dto)

    }

    @Post('/login')
    async Login(@Body()dto:Logindto){
        return await this.userservice.login(dto)
    }


}