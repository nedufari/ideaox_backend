import { Module } from "@nestjs/common";
import { CmsService } from "./cms.service";
import { CmsController } from "./cms.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "src/Entity/admin.entity";
import { UserEntity } from "src/Entity/user.entity";
import { CommentsEntity } from "src/Entity/comment.entity";
import { RepliesEntity } from "src/Entity/reply.entity";
import { UploadService } from "src/helpers/upload.service";
import { Notifications } from "src/Entity/notification.entity";
import { IdeaEntity } from "src/Entity/idea.entity";

@Module({
    imports:[TypeOrmModule.forFeature([IdeaEntity,AdminEntity,UserEntity,CommentsEntity,RepliesEntity,Notifications])],
    providers:[CmsService,UploadService],
    controllers:[CmsController]
})

export class CmsModule{}