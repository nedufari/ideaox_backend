import { Gender, Role } from "src/Enum/general.enum"

export interface IAdmin{
    id:number
    fullname:string
    email:string
    password:string
    createdAt:Date
    gender:Gender
    profilePicture:string
    role:Role
    isLoggedIn:boolean
    isVerified:boolean
    isRegistered:boolean
    isLoggedOut:boolean
    isLocked:boolean
    locked_until:Date 
    reset_link_exptime:Date
    password_reset_link:string
    loginCount:number
 
}

export interface IAdminResponse{
    id:number
    fullname:string
    email:string
    gender:Gender
    createdAt:Date
    profilePicture:string
    role:Role
    isLoggedIn:boolean
    isVerified:boolean
    isRegistered:boolean
    isLoggedOut:boolean 
    loginCount:number

}

