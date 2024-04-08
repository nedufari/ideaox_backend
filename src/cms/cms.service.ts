import { ForbiddenException, Injectable, MethodNotAllowedException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/Entity/admin.entity';
import { UserEntity } from 'src/Entity/user.entity';
import { AdminRepository } from 'src/Users/admin/admin.repository';
import { UserRepository } from 'src/Users/user/user.reposiroty';
import {
  CmsRepository,
  CommentRepository,
  RepliesRepository,
} from './cms.repository';
import { EditblogPostDto, MakeblogPostDto } from './cms.dto';
import { CommentsEntity } from 'src/Entity/comment.entity';
import { RepliesEntity } from 'src/Entity/reply.entity';
import { UploadService } from 'src/helpers/upload.service';
import {  IIdeaPostViewWithComment, IIdeaView } from './cms';
import { Notifications } from 'src/Entity/notification.entity';
import { LikeAction, NotificationType } from 'src/Enum/general.enum';
import { NotificationRepository } from 'src/common/common.repository';
import { Not } from 'typeorm';
import { CommentDto, LikeDto, ReplyDto } from 'src/common/common.dto';
import { repl } from '@nestjs/core';
import { IdeaEntity } from 'src/Entity/idea.entity';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(AdminEntity) private readonly adminrepo: AdminRepository,
    @InjectRepository(UserEntity) private readonly userrepo: UserRepository,
    @InjectRepository(IdeaEntity) private readonly blogrepo: CmsRepository,
    @InjectRepository(CommentsEntity)
    private readonly commentrepo: CommentRepository,
    @InjectRepository(RepliesEntity)
    private readonly repliesrepo: RepliesRepository,
    @InjectRepository(Notifications)
    private readonly noticicationrepo: NotificationRepository,
    private readonly fileuploadservice: UploadService,
  ) {}

  //create blog post

  async createIdea(
    id: number,
    dto: MakeblogPostDto,
    mediafiles: Express.Multer.File[],
  ): Promise<IIdeaView> {
    const blogger = await this.userrepo.findOne({ where: { id: id } });
    if (!blogger)
      throw new NotFoundException('this user isnt found in our system');

    const medialfileUrls: string[] = [];

    for (const file of mediafiles) {
      const medialurl = await this.fileuploadservice.uploadFile(file);
      medialfileUrls.push(
        `http:localhost:3000/api/v1/blogpost/blog-post/uploadfile/public/${medialurl}`,
      );
    }

    const newblog = await this.blogrepo.create({
    idea : dto.idea,
    media : medialfileUrls,
    tags:dto.tag,
    createdAt : new Date(),
    blogger : blogger,

    })
    await this.blogrepo.save(newblog);


     //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'New BlogPost Created!';
     notification.notification_type = NotificationType.BLOGPOST_CREATED;
     notification.message = `new blog created successfully `;
     await this.noticicationrepo.save(notification);

     
    //response
    const blogPostResponse: IIdeaView = {
      idea: newblog.idea,
      tags:newblog.tags,
      media: newblog.media,
      likes: newblog.likes,
      createdAt: newblog.createdAt,
      blogger: {
        fullname: newblog.blogger.fullname,
        profilepicture: newblog.blogger.profilePicture,
      },
    };
    return blogPostResponse;
  }


  // edit blogpost
  async EditIdea(
    postid: number,
    dto: EditblogPostDto,
    userid:number,
    mediafiles: Express.Multer.File[],
  ): Promise<IIdeaView> {
    const blogger = await this.userrepo.findOne({ where: { id: userid } });
    if (!blogger)
      throw new NotFoundException('this user isnt found in our system');


      const blog = await this.blogrepo.findOne({where:{id:postid}})
      if (!blog) throw new NotFoundException('post not found')

    const medialfileUrls: string[] = [];

    for (const file of mediafiles) {
      const medialurl = await this.fileuploadservice.uploadFile(file);
      medialfileUrls.push(
        `http:localhost:3000/api/v1/blogpost/blog-post/uploadfile/public/${medialurl}`,
      );
    }

    const newblog =  new IdeaEntity()
    newblog.idea = dto.idea,
    newblog.media = medialfileUrls,
    newblog.createdAt = new Date(),
    newblog.blogger = blogger,

    
    await this.blogrepo.save(newblog);


     //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'BlogPost Updated !';
     notification.notification_type = NotificationType.BLOGPOST_EDITED;
     notification.message = `existing blogpost updated successfully `;
     await this.noticicationrepo.save(notification);

     
    //response
    const blogPostResponse: IIdeaView = {
      idea: newblog.idea,
      tags:newblog.tags,
      media: newblog.media,
      likes: newblog.likes,
      createdAt: newblog.createdAt,
      blogger: {
        fullname: newblog.blogger.fullname,
        profilepicture: newblog.blogger.profilePicture,
      },
    };
    return blogPostResponse;
  }



  //get all blogpost ( add paginations )

  async getAllIdeas(page: number = 1, limit: number = 10): Promise<{ blogPosts: IIdeaPostViewWithComment[], total: number }> {
    const skip = (page - 1) * limit;

    // Fetch blog posts with pagination
    const [blogPosts, total] = await this.blogrepo.findAndCount({
        relations: ['blogger', 'comments_made', 'comments_made.made_by', 'comments_made.replies', 'comments_made.replies.replied_by'], // Assuming relations are correctly defined
        order: { createdAt: 'DESC' },
        take: limit,
        skip: skip
    });

    // Format response
    const formattedBlogPosts: IIdeaPostViewWithComment[] = blogPosts.map(blog => ({
        id:blog.id,
        idea: blog.idea,
        tags:blog.tags,
        media: blog.media,
        likes: blog.likes,
        createdAt: blog.createdAt,
        blogger: {
            fullname: blog.blogger.fullname,
            profilepicture: blog.blogger.profilePicture
        },
        comments: blog.comments_made.map(comment => ({
            comment: comment.comment,
            likes:comment.likes,
            madeAT: comment.madeAT,
            made_by: {
                fullname: comment.made_by.fullname,
                profilepicture: comment.made_by.profilePicture
            },
            replies: comment.replies.map(reply => ({
                reply: reply.reply,
                likes:reply.likes,
                repliedAt: reply.repliedAt,
                replied_by: {
                    fullname: reply.replied_by.fullname,
                    profilepicture: reply.replied_by.profilePicture
                }
            }))
        }))
    }));

    return { blogPosts: formattedBlogPosts, total };
}



  //getone blogpost

  async getOneIdea(id:number):Promise<IIdeaPostViewWithComment>{
    const blog = await this.blogrepo.findOne({ where: { id: id },relations: ['blogger', 'comments_made', 'comments_made.made_by', 'comments_made.replies', 'comments_made.replies.replied_by'] });
    if (!blog)
      throw new NotFoundException('this blogpost does not exist in the system');

      //response 

      const response : IIdeaPostViewWithComment ={
        id:blog.id,
        idea: blog.idea,
        tags:blog.tags,
        media: blog.media,
        likes: blog.likes,
        createdAt: blog.createdAt,
        blogger: {
            fullname: blog.blogger.fullname,
            profilepicture: blog.blogger.profilePicture
        },
        comments: blog.comments_made.map(comment => ({
            comment: comment.comment,
            likes:comment.likes,
            madeAT: comment.madeAT,
            made_by: {
                fullname: comment.made_by.fullname,
                profilepicture: comment.made_by.profilePicture
            },
            replies: comment.replies.map(reply => ({
                reply: reply.reply,
                likes:reply.likes,
                repliedAt: reply.repliedAt,
                replied_by: {
                    fullname: reply.replied_by.fullname,
                    profilepicture: reply.replied_by.profilePicture
                }
            }))
        }))

      }
      return response

  }


  //deleteblogpost
  async deleteIdea(id:number, userid:number):Promise<{msg:string}>{
    const blogger = await this.userrepo.findOne({where:{id:userid}})
    if (!blogger) throw new NotFoundException('user not found')

    const blog = await this.blogrepo.findOne({ where: { id: id },relations: ['blogger', 'comments_made', 'comments_made.made_by', 'comments_made.replies', 'comments_made.replies.replied_by'] });
    if (!blog) throw new NotFoundException('post not found')


  //  // Check if the user deleting the post is the owner
  if (blogger.id !== blog.blogger.id) {
    throw new UnauthorizedException('You are not authorized to delete a post you did not create');
  }


    await this.blogrepo.remove(blog)

     //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'BlogPost deleted !';
     notification.notification_type = NotificationType.BLOGPOST_DELETED;
     notification.message = `existing blogpost deleted successfully `;
     await this.noticicationrepo.save(notification);

    return {msg:'the idea has been deleted '}
  }


  //comment on blogpost
  async MakeAComment(postid:number, userid:number, dto:CommentDto ) :Promise<{msg:string}>{
    const blogger = await this.userrepo.findOne({where:{id:userid}})
    if (!blogger) throw new NotFoundException('user not found')

    const blog = await this.blogrepo.findOne({where:{id:postid}})
    if (!blog) throw new NotFoundException('post not found')

    const comment = new CommentsEntity()
    comment.comment = dto.comment
    comment.madeAT = new Date()
    comment.made_by = blogger
    comment.idea = blog

    await this.commentrepo.save(comment)

     //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'comment made !';
     notification.notification_type = NotificationType.COMMENT_MADE;
     notification.message = `a comment has been made on a post successfully `;
     await this.noticicationrepo.save(notification);

     return {msg:'a comment has been made successfully'}
  }


  //editing comment 
  async deleteCommentPost(commentid:number, userid:number):Promise<{msg:string}>{
    const blogger = await this.userrepo.findOne({where:{id:userid}})
    if (!blogger) throw new NotFoundException('user not found')

    const comment = await this.commentrepo.findOne({where:{id:commentid}})
    if (!comment) throw new NotFoundException('post not found')

    await this.commentrepo.remove(comment)

     //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'comment deleted !';
     notification.notification_type = NotificationType.COMMENT_DELETED;
     notification.message = `existing comment deleted successfully `;
     await this.noticicationrepo.save(notification);

    return {msg:'the comment has been deleted '}
  }

  // editing  comment 
  async EditAComment(commentid:number, userid:number, dto:CommentDto ) :Promise<{msg:string}>{
    const blogger = await this.userrepo.findOne({where:{id:userid}})
    if (!blogger) throw new NotFoundException('user not found')

    const blog = await this.commentrepo.findOne({where:{id:commentid}})
    if (!blog) throw new NotFoundException('comment not found')

    const comment = new CommentsEntity()
    comment.comment = dto.comment
    comment.madeAT = new Date()
    comment.made_by = blogger

    await this.commentrepo.save(comment)

     //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'comment edited !';
     notification.notification_type = NotificationType.COMMENT_EDITED;
     notification.message = `a comment has been edited successfully `;
     await this.noticicationrepo.save(notification);

     return {msg:'a comment has been edited successfully'}
  }



  // reply a comment on blog post
   async ReplyAComment(commentid:number, userid:number, dto:ReplyDto ) :Promise<{msg:string}>{
    const blogger = await this.userrepo.findOne({where:{id:userid}})
    if (!blogger) throw new NotFoundException('user not found')

    const comment = await this.commentrepo.findOne({where:{id:commentid}})
    if (!comment) throw new NotFoundException('comment not found')

    const reply = new RepliesEntity()
    reply.reply = dto.reply
    reply.comment_replied = comment,
    reply.repliedAt = new Date()
    reply.replied_by = blogger,

    await this.repliesrepo.save(reply)

     //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'Replied A Comment !';
     notification.notification_type = NotificationType.REPLIED_A_COMMENT;
     notification.message = `a reply as been made to a comment successfully `;
     await this.noticicationrepo.save(notification);

     return {msg:'a reply has been made to a comment'}
  }

 
  //deleting reply 
  async deleteReply(commentid:number, userid:number):Promise<{msg:string}>{
    const blogger = await this.userrepo.findOne({where:{id:userid}})
    if (!blogger) throw new NotFoundException('user not found')

    const reply = await this.repliesrepo.findOne({where:{id:commentid}})
    if (!reply) throw new NotFoundException('post not found')

    await this.repliesrepo.remove(reply)

     //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'reply deleted !';
     notification.notification_type = NotificationType.REPLY_DELETED;
     notification.message = `existing reply to a comment deleted successfully `;
     await this.noticicationrepo.save(notification);

    return {msg:'the reply has been deleted '}
  }

  // editing  reply 
  async EditAReply(replyid:number, userid:number, dto:ReplyDto ) :Promise<{msg:string}>{
    const blogger = await this.userrepo.findOne({where:{id:userid}})
    if (!blogger) throw new NotFoundException('user not found')

    const replycomment = await this.repliesrepo.findOne({where:{id:replyid}})
    if (!replycomment) throw new NotFoundException('post not found')

   
   
    const reply = new RepliesEntity()
    reply.reply = dto.reply
    reply.repliedAt = new Date()
    reply.replied_by = blogger,

  

    await this.repliesrepo.save(reply)

     //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'reply edited !';
     notification.notification_type = NotificationType.COMMENT_EDITED;
     notification.message = `a reply has been edited successfully `;
     await this.noticicationrepo.save(notification);

     return {msg:'a reply has been edited successfully'}
  }




  //like a post 
  async LikeAPost(postid:number, userid:number, dto:LikeDto):Promise<{msg:string}>{
    const blogger = await this.userrepo.findOne({where:{id:userid}})
    if (!blogger) throw new NotFoundException('user not found')

    const blog = await this.blogrepo.findOne({where:{id:postid}})
    if (!blog) throw new NotFoundException('post not found')

    if (dto.like && dto.like === LikeAction.LIKE){
      blog.likes +=1
      await this.blogrepo.save(blog)


       //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'Liked A Post !';
     notification.notification_type = NotificationType.LIKED_A_POST;
     notification.message = `liked a post `;
     await this.noticicationrepo.save(notification);

    }

    return {msg:'you have liked a post'}

  }


  //like a comment 
  async LikeAComment(commentid:number, userid:number, dto:LikeDto):Promise<{msg:string}>{
    const blogger = await this.userrepo.findOne({where:{id:userid}})
    if (!blogger) throw new NotFoundException('user not found')

    const blog = await this.commentrepo.findOne({where:{id:commentid}})
    if (!blog) throw new NotFoundException('comment not found')

    if (dto.like && dto.like === LikeAction.LIKE){
      blog.likes +=1
      await this.commentrepo.save(blog)


       //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'Liked A comment !';
     notification.notification_type = NotificationType.LIKED_A_COMMENT;
     notification.message = `liked a comment successfully `;
     await this.noticicationrepo.save(notification);

    }

    return {msg:'you have liked a comment'}

  }


   //like a comment 
   async LikeAReply(replyid:number, userid:number, dto:LikeDto):Promise<{msg:string}>{
    const blogger = await this.userrepo.findOne({where:{id:userid}})
    if (!blogger) throw new NotFoundException('user not found')

    const blog = await this.repliesrepo.findOne({where:{id:replyid}})
    if (!blog) throw new NotFoundException('reply not found')

    if (dto.like && dto.like === LikeAction.LIKE){
      blog.likes +=1
      await this.repliesrepo.save(blog)


       //save the notification
     const notification = new Notifications();
     notification.account = blogger.fullname;
     notification.subject = 'Liked A Reply !';
     notification.notification_type = NotificationType.LIKED_A_REPLY;
     notification.message = `liked a Reply `;
     await this.noticicationrepo.save(notification);

    }

    return {msg:'you have liked a reply'}

  }

}
