import { Body, Controller,Post,Patch } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./admin.dto";
import { FinallyResetPasswordDto, Logindto, RequestOtpResendDto, SendPasswordResetLinkDto, VerifyOtpDto } from "src/common/common.dto";

@Controller('admin')
export class AdminController{
    constructor(private readonly adminservice:AdminService){}


    @Post('/register')
    async Registeradmin(@Body()dto:CreateAdminDto):Promise<{message:string}>{
        return await this.adminservice.createSuperAdmin(dto)
    }

    @Post('/verify-email')
    async Verify_email(@Body()dto:VerifyOtpDto,):Promise<{isValid:boolean; accessToken:any}>{
        return await this.adminservice.SuperAdminverifyEmail(dto)
    }

 

    @Post('/resend-verification-link')
    async resendVerificationLink(@Body()dto:RequestOtpResendDto):Promise<{message:string}>{
        return await this.adminservice.AdminResendemailVerificationLink(dto)

    }

    @Post('/send-password-reset-link')
    async sendPasswordResetLink (@Body()dto:SendPasswordResetLinkDto):Promise<{message:string}>{
        return await this.adminservice.AdminsendPasswordResetLink(dto)
    }

    @Patch('/reset-password')
    async ResetPassword(@Body()dto:FinallyResetPasswordDto):Promise<{message:string}>{
        return await this.adminservice.AdminfinallyResetPassword(dto)

    }

    @Post('/login')
    async Login(@Body()dto:Logindto){
        return await this.adminservice.loginAdmin(dto)
    }
}