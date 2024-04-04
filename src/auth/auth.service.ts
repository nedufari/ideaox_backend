import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "src/Entity/admin.entity";
import { UserEntity } from "src/Entity/user.entity";
import { AdminRepository } from "src/Users/admin/admin.repository";
import { UserRepository } from "src/Users/user/user.reposiroty";

@Injectable()
export class AuthService{
    constructor(@InjectRepository(AdminEntity)private readonly adminrepo:AdminRepository,
    @InjectRepository(UserEntity)private readonly userrepo:UserRepository){}

    //validateuseroradminbyidandrole

    async ValidateuserOrAdminByIdandRole(id:number, role:string){
        switch(role){
            case "admin":
                return await this.adminrepo.findOne({where:{id:id}})
            case "user":
                return await this.userrepo.findOne({where:{id:id}})
            default:
                return null
        }
    }

}