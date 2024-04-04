import { CommentsEntity } from "src/Entity/comment.entity"
import { UserEntity } from "src/Entity/user.entity"
import { IdeaTags } from "src/Enum/general.enum"

export interface IIdea{
    id:number
    idea:string
    tags:IdeaTags
    media:string[]
    createdAt:Date
    likes:number
    blogger:UserEntity
    comments_made:CommentsEntity[]
    

}

export interface IIdeaView{
    idea:string
    tags:IdeaTags
    media:string[]
    createdAt:Date
    likes:number
    blogger:IBloggerInfo
   

}
export interface IIdeaPostViewWithComment {
    id:number
    idea: string;
    tags:IdeaTags
    media: string[];
    createdAt: Date;
    likes: number;
    blogger: IBloggerInfo;
    comments: ICommentWithReplies[];
}

interface IBloggerInfo {
    fullname: string;
    profilepicture: string;
}

interface ICommentWithReplies {
    comment: string;
    likes:number
    madeAT: Date;
    made_by: IBloggerInfo;
    replies: IReply[];
}

interface IReply {
    reply: string;
    repliedAt: Date;
    likes:number
    replied_by: IBloggerInfo;
}
