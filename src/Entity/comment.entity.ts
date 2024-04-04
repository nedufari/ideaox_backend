import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { RepliesEntity } from "./reply.entity";
import { IdeaEntity } from "./idea.entity";


export interface IComment{
    id:number,
    comment:string,
    madeAT:Date,
    likes:number
    made_by: UserEntity
    idea: IdeaEntity
    replies:RepliesEntity[]

}


@Entity()
export class CommentsEntity implements IComment{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    comment: string;

    @Column({nullable:true,default:0})
    likes: number;

    @CreateDateColumn()
    madeAT: Date;

    @ManyToOne(()=>UserEntity,user=>user.my_comment)
    made_by:UserEntity

    @ManyToOne(()=>IdeaEntity,blogpost=>blogpost.idea)
    idea:IdeaEntity

    @OneToMany(()=>RepliesEntity,reply=>reply.comment_replied,{cascade:true})
    replies:RepliesEntity[]
}