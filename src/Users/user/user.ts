
import { CommentsEntity } from "src/Entity/comment.entity"
import { IdeaEntity } from "src/Entity/idea.entity"
import { RepliesEntity } from "src/Entity/reply.entity"
import { Gender, Role } from "src/Enum/general.enum"

export interface IUser{
    id:number
    fullname:string
    email:string
    password:string
    dob: string
    age:number
    gender:Gender
    createdAt:Date
    profilePicture:string
    role:Role
    isLoggedIn:boolean
    isVerified:boolean
    isRegistered:boolean
    isLoggedOut:boolean 
    reset_link_exptime:Date
    password_reset_link:string
    loginCount:number
    isLocked:boolean
    locked_until:Date 
    my_comment:CommentsEntity[]
    comment_replies :RepliesEntity[]
    my_blogs:IdeaEntity[]
}

export interface IUserResponse{
    id:string
    fullname:string
    email:string
    dob: Date
    age:number
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

