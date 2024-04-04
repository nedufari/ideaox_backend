import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "src/Entity/admin.entity";
import { AdminRepository } from "./admin.repository";
import { Notifications } from "src/Entity/notification.entity";
import { NotificationRepository, OtpRepository } from "src/common/common.repository";
import { UserOtp } from "src/Entity/otp.entity";
import { CreateAdminDto } from "./admin.dto";
import * as bcrypt from 'bcrypt';
import { NotificationType, Role } from "src/Enum/general.enum";
import { customAlphabet } from "nanoid";
import { Mailer } from "src/Mailer/mailer.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { FinallyResetPasswordDto, Logindto, RequestOtpResendDto, SendPasswordResetLinkDto, VerifyOtpDto } from "src/common/common.dto";


@Injectable()
export class AdminService{
    constructor(@InjectRepository(AdminEntity)private readonly adminrepo:AdminRepository,
    @InjectRepository(Notifications)private readonly noticicationrepo:NotificationRepository,
    @InjectRepository(UserOtp)private readonly otprepo:OtpRepository,
    private readonly mailerservice:Mailer,
    private configservice:ConfigService,
    private jwt:JwtService
    )
    {}

    
    async hashpassword(password): Promise<string> {
        return await bcrypt.hash(password,12);
      }
    
      public async comaprePassword(userpassword, dbpassword): Promise<boolean> {
        return await bcrypt.compare(userpassword, dbpassword);
      }

      public generateEmailToken():string{
        const gen = customAlphabet('12345678990',6)
        return gen()
      }


      //access token 
 public  async signToken(id: number, email: string,role:string) {
    const payload = {
      sub: id,
      email,
      role
    };
    const secret = this.configservice.get('SECRETKEY');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.configservice.get('EXPIRESIN'),
      secret: secret,
    });
    return { accesstoken: token };
  }



    //sign up admin

    async createSuperAdmin(
        dto: CreateAdminDto,
      ): Promise<{ message: string }> {
        const checkemail = await this.adminrepo.findOne({
          where: { email: dto.email },
        });
        if (checkemail)
          throw new HttpException(
            'this super admin already exists',
            HttpStatus.FOUND,
          );
    
        const hashedpassword = await this.hashpassword(dto.password);
    
        const admin = new AdminEntity();
        admin.email = dto.email;
        admin.password = hashedpassword;
        admin.fullname = dto.fullname
        admin.role = Role.ADMIN;
        admin.createdAt = new Date();
        await this.adminrepo.save(admin);
    
        //2fa authentication 
        const emiailverificationcode =  await this.generateEmailToken()
        
         // mail
         await this.mailerservice.SendVerificationeMail(dto.email, dto.fullname)
    
        //otp
        const otp = new UserOtp();
        otp.email = dto.email;
        otp.otp = emiailverificationcode;
        otp.role = admin.role;
        const fiveminuteslater = new Date();
        await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes() + 10);
        otp.expiration_time = fiveminuteslater;
        await this.otprepo.save(otp);
    
    
        //save the notification
        const notification = new Notifications();
        notification.account = admin.fullname;
        notification.subject = 'New Super Admin!';
        notification.notification_type = NotificationType.ADMIN_CREATED;
        notification.message = `new admin created successfully `;
        await this.noticicationrepo.save(notification);
    
        return {
          message:
            'you have successfully registered as an admin, please check your mail for the otp verification',
        };
      }




    // verify email of admin 


    async SuperAdminverifyEmail(dto:VerifyOtpDto):Promise<{isValid:boolean; accessToken:any}>{
        const findemail= await this.otprepo.findOne({where:{email:dto.email}})
        if (!findemail) throw new HttpException('the user does not match the owner of the otp',HttpStatus.NOT_FOUND)
        //find the otp privided if it matches with the otp stored 
        const findotp= await this.otprepo.findOne({where:{otp:dto.otp}})
        if (!findotp) throw new HttpException('you provided an invalid otp,please go back to your mail and confirm the OTP sent to you', HttpStatus.BAD_REQUEST)
        
        //find if the otp is expired 
        if ( findotp.expiration_time <= new Date()) throw new HttpException('otp is expired please request for another one',HttpStatus.REQUEST_TIMEOUT)
    
        //return valid and the access token if the user matches 
    
        const admin = await this.adminrepo.findOne({where:{email:dto.email}})
        if (admin.email !== findemail.email) throw new HttpException("this email does not match the customer record we have ", HttpStatus.NOT_FOUND)
        else{
         
          admin.isVerified=true
          admin.isLoggedIn=true
          admin.isRegistered =true
        
    
         const notification = new Notifications()
          notification.account= admin.fullname,
          notification.subject="Super Admin Verified!"
          notification.notification_type=NotificationType.EMAIL_VERIFICATION
          notification.message=`Hello ${admin.fullname}, your email has been successfully verified `
          await this.noticicationrepo.save(notification)
    
          //await this.mailerservice.SendWelcomeEmail(admin.email,admin.brandname)
    
          await this.adminrepo.save(admin)
    
          const accessToken= await this.signToken(admin.id,admin.email,admin.role)

          return {isValid:true, accessToken}
        }
      }



    // resend email verification otp 

    async AdminResendemailVerificationLink (dto:RequestOtpResendDto):Promise<{message:string}>{
        const emailexsist = await this.adminrepo.findOne({where: { email: dto.email },select: ['id', 'email','role']});
          if (!emailexsist)
            throw new HttpException(
              `user with email: ${dto.email} exists, please use another unique email`,
              HttpStatus.CONFLICT,
            );
         // Generate a new OTP
         const emiailverificationcode= await this.generateEmailToken() // Your OTP generated tokens
         
         // Save the token with expiration time
         const fiveminuteslater=new Date()
         await fiveminuteslater.setMinutes(fiveminuteslater.getMinutes()+10)

        //save the token
         const newOtp = this.otprepo.create({ 
          email:dto.email, 
          otp:emiailverificationcode, 
          expiration_time: fiveminuteslater,
          role: emailexsist.role
        });
         await this.otprepo.save(newOtp);
    
         //save the notification 
         const notification = new Notifications()
         notification.account= emailexsist.fullname
         notification.subject="Otp Resent!"
         notification.notification_type=NotificationType.EMAIL_VERIFICATION
         notification.message=`Hello ${emailexsist.fullname}, a new verification Link has been resent to your mail `
         await this.noticicationrepo.save(notification)
     
         
           //send mail 
           await this.mailerservice.SendVerificationeMail(newOtp.email, emailexsist.fullname)
    
           return {message:'New Otp verification code has been sent successfully'}
           
       }


       async AdminsendPasswordResetLink(dto:SendPasswordResetLinkDto):Promise<{message:string}>{
        const isEmailReistered= await this.adminrepo.findOne({where:{email:dto.email}})
        if (!isEmailReistered) throw new HttpException(`this email ${dto.email} does not exist in our system, please try another email address`,HttpStatus.NOT_FOUND)
    
        const resetlink= await this.generateEmailToken()
        const expirationTime = new Date();
          expirationTime.setHours(expirationTime.getHours() + 1);
    
        //send reset link to the email provided 
        await this.mailerservice.SendPasswordResetLinkMail(dto.email,resetlink,isEmailReistered.fullname)
    
        //save the reset link and the expiration time to the database 
        isEmailReistered.password_reset_link = resetlink
        isEmailReistered.reset_link_exptime = expirationTime
        await this.adminrepo.save(isEmailReistered)
    
        const notification = new Notifications()
        notification.account= isEmailReistered.fullname,
        notification.subject="password Reset link!"
        notification.notification_type=NotificationType.EMAIL_VERIFICATION
        notification.message=`Hello ${isEmailReistered.fullname}, password resent link sent `
        await this.noticicationrepo.save(notification)
    
    
    
        return {message:"the password reset link has been sent successfully"}
        
      }


    
      async AdminfinallyResetPassword(dto:FinallyResetPasswordDto):Promise<{message:string}>{
        const verifyuser= await this.adminrepo.findOne({where:{email:dto.email}})
        if (!verifyuser) throw new HttpException('this user is not registered with elfevents',HttpStatus.NOT_FOUND)
    
        //compare token 
        if (verifyuser.password_reset_link !== dto.otp) throw new HttpException('the link is incorrect please retry or request for another link',HttpStatus.NOT_ACCEPTABLE)
    
        //take new password 
        const newpassword= await this.hashpassword(dto.password)
        verifyuser.password=newpassword
    
        await this.adminrepo.save(verifyuser)
    
        const notification = new Notifications()
        notification.account= verifyuser.fullname,
        notification.subject="New Customer!"
        notification.notification_type=NotificationType.EMAIL_VERIFICATION
        notification.message=`Hello ${verifyuser.fullname}, password reset link verified and the password has been recently reseted `
        await this.noticicationrepo.save(notification)
    
    
        return {message:"your password has been reset susscessfully"}
      }



     //login admin 

  async loginAdmin(logindto:Logindto){
    const findadmin= await this.adminrepo.findOne({where:{email:logindto.email}})
    if (!findadmin) throw new HttpException(`invalid credential`,HttpStatus.NOT_FOUND)
    const comparepass=await this.comaprePassword(logindto.password,findadmin.password)
    if (!comparepass) {
      findadmin.loginCount+=1;

      if (findadmin.loginCount>=5){
        findadmin.isLocked=true
        findadmin.locked_until= new Date(Date.now()+24*60*60*1000) //lock for 24 hours 
        await this.adminrepo.save(findadmin)
        throw new HttpException(`invalid password`,HttpStatus.UNAUTHORIZED)
      }

      //  If the customer hasn't reached the maximum login attempts, calculate the number of attempts left
    const attemptsleft= 5 - findadmin.loginCount
    await this.adminrepo.save(findadmin)

    throw new HttpException(`invalid credentials ${attemptsleft} attempts left before your account is locked.`,HttpStatus.UNAUTHORIZED)
  
    }

    if (!findadmin.isVerified) {
      // If the account is not verified, throw an exception
      throw new ForbiddenException(
        `Your account has not been verified. Please verify your account by requesting a verification code.`
      );
    }

     //If the password matches, reset the login_count and unlock the account if needed
    findadmin.loginCount = 0;
    findadmin.isLoggedIn = true;
    await this.adminrepo.save(findadmin)

    //save the notification 
    const notification = new Notifications()
    notification.account= findadmin.fullname
    notification.subject="Photographer just logged in!"
    notification.notification_type=NotificationType.LOGGED_IN
    notification.message=`Hello ${findadmin.fullname}, just logged in `
    await this.noticicationrepo.save(notification)

    return await this.signToken(findadmin.id,findadmin.email,findadmin.role)

  }


}