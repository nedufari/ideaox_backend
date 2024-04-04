import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "src/Entity/admin.entity";
import { UserEntity } from "src/Entity/user.entity";
import { RoleGuard } from "./guard/role.guard";
import { JwtGuard } from "./guard/jwt.guard";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
    providers:[AuthService,RoleGuard,JwtGuard,JwtStrategy],
    imports:[TypeOrmModule.forFeature([AdminEntity,UserEntity]),
        JwtModule.registerAsync({
        useFactory:()=>({
            secret:process.env.SECRETKEY,
            signOptions:{expiresIn:process.env.EXPIRESIN}
        })
    })],
    
})
export class AuthModule{}