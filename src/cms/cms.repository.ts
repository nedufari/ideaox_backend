
import { CommentsEntity } from "src/Entity/comment.entity";
import { IdeaEntity } from "src/Entity/idea.entity";
import { RepliesEntity } from "src/Entity/reply.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(IdeaEntity)
export class CmsRepository extends Repository <IdeaEntity>{}

@EntityRepository(CommentsEntity)
export class CommentRepository extends Repository <CommentsEntity>{}

@EntityRepository(RepliesEntity)
export class RepliesRepository extends Repository <RepliesEntity>{}