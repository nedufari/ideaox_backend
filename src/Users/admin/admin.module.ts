import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { Mailer } from "src/Mailer/mailer.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notifications } from "src/Entity/notification.entity";
import { UserOtp } from "src/Entity/otp.entity";
import { AdminEntity } from "src/Entity/admin.entity";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports:[TypeOrmModule.forFeature([Notifications,UserOtp,AdminEntity])],
    providers:[AdminService,Mailer,JwtService,],
    controllers:[AdminController]
})

export class AdminModule{}