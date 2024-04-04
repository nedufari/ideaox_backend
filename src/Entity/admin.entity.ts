import { Gender, Role } from "src/Enum/general.enum";
import { IAdmin } from "src/Users/admin/admin";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AdminEntity implements IAdmin{
    @PrimaryGeneratedColumn()
    id:number 

    @Column({nullable:false})
    fullname: string;

    @Column({nullable:false,unique:true})
    email: string;

    @Column({nullable:false})
    password: string;

    @Column({nullable:true})
    profilePicture: string;

    @CreateDateColumn({nullable:false})
    createdAt: Date;

    @Column({nullable:false, type:'enum', enum:Role, default:Role.USER})
    role: Role;

    @Column({nullable:false,type:'enum', enum:Gender, default:Gender.Rather_not_say})
    gender: Gender;

    @Column({nullable:false,default:false})
    isLoggedIn: boolean;

    @Column({nullable:false,default:false})
    isLoggedOut: boolean;

    @Column({nullable:false,default:false})
    isRegistered: boolean;

    @Column({nullable:false,default:false})
    isVerified: boolean;

    @Column({nullable:true})
    reset_link_exptime: Date;

    @Column({nullable:true})
    password_reset_link: string;

    @Column({nullable:false, default:0})
    loginCount: number;

    @Column({nullable:false, default:false})
    isLocked: boolean;

    @Column({nullable:true})
    locked_until: Date;







    
}