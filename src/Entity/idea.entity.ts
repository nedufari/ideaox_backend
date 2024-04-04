import {  IIdea } from "src/cms/cms";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { CommentsEntity } from "./comment.entity";
import { IdeaTags } from "src/Enum/general.enum";

@Entity()
export class IdeaEntity implements IIdea{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:true})
    idea: string;

    @Column({type:'enum',enum:IdeaTags, nullable:false})
    tags:IdeaTags

    @Column({type:'jsonb',nullable:true,})
    media:string[]

    @Column({nullable:false,default:0})
    likes: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(()=>UserEntity,user=>user.my_blogs)
    blogger: UserEntity;

    @OneToMany(()=>CommentsEntity, comments=>comments.idea)
    comments_made: CommentsEntity[];

}