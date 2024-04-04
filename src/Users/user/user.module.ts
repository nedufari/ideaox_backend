import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Mailer } from "src/Mailer/mailer.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/Entity/user.entity";
import { UserOtp } from "src/Entity/otp.entity";
import { Notifications } from "src/Entity/notification.entity";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity,UserOtp,Notifications])],
    providers:[UserService,Mailer,JwtService],
    controllers:[UserController]
})
export class UserModule{}