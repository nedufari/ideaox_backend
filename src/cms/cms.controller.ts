import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { CmsService } from "./cms.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { MakeblogPostDto } from "./cms.dto";
import {  IIdeaPostViewWithComment, IIdeaView } from "./cms";
import { CommentDto, LikeDto, ReplyDto } from "src/common/common.dto";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { RoleGuard } from "src/auth/guard/role.guard";
import { Roles } from "src/auth/decorators/role.decorator";
import { Role } from "src/Enum/general.enum";


@UseGuards(JwtGuard)


@Controller('idea')
export class CmsController{
    constructor(private readonly cmsService:CmsService){}


    //blog-posts 
    // @UseGuards(RoleGuard)
    // @Roles(Role.USER)
    @Post('create-idea/:id')
    @UseInterceptors(FilesInterceptor('media',10))
    async createIdea(@Param('id')id:number, @Body()dto:MakeblogPostDto, @UploadedFiles()mediafiles:Express.Multer.File[]):Promise<IIdeaView>{
        try {
            return await this.cmsService.createIdea(id,dto,mediafiles)
        } catch (error) {
            throw error
            
        }
    }
    @UseGuards(RoleGuard)
    @Roles(Role.USER)
    @Patch('edit-idea/:postid/:userid')
    @UseInterceptors(FilesInterceptor('media',10))
    async editIdea(@Param('id')postid:number, @Param('id')userid:number, @Body()dto:MakeblogPostDto, @UploadedFiles()mediafiles:Express.Multer.File[]):Promise<IIdeaView>{
        try {
            return await this.cmsService.EditIdea(postid,dto,userid,mediafiles)
        } catch (error) {
            throw error
            
        }
    }


   
    @Delete('delete-idea/:ideaId/:userId')
    async DeleteIdea(@Param('ideaId')ideaid:number, @Param('userId')userid:number,@Req()req):Promise<{msg:string}>{
        try {
            const userfromreq = req.user.id
            console.log(req.user)
            //if (userfromreq !== userid) throw new ForbiddenException('you can only delete an idea you created')
            return await this.cmsService.deleteIdea(ideaid,userid)
        } catch (error) {
            throw error
            
        }
    }

    // @UseGuards(RoleGuard)
    // @Roles(Role.USER,Role.ADMIN)
    @Get('all-ideas')
    async getBlogPosts(
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        try {
            const { blogPosts, total } = await this.cmsService.getAllIdeas(page, limit);
            return {
                data: blogPosts,
                total: total,
                page: page,
                limit: limit
            };
        } catch (error) {
            throw error
            
        }
    }

    // @UseGuards(RoleGuard)
    // @Roles(Role.USER,Role.ADMIN)
    @Get('one-idea/:id')
    async getoneIdea(@Param('id')id:number):Promise<IIdeaPostViewWithComment>{
        try {
            return await this.cmsService.getOneIdea(id)
        } catch (error) {
            throw error
            
        }
    }


    @UseGuards(RoleGuard)
    @Roles(Role.USER)
    @Patch('like-an-idea/:postid/:userid')
    async LikePost(@Param('postid')postid:number, @Param('userid')userid:number,@Body()dto:LikeDto):Promise<{msg:string}>{
        try {
            return await this.cmsService.LikeAPost(postid,userid,dto)
            
        } catch (error) {
            throw error
            
        }
        
    }


    // comment 
    @UseGuards(RoleGuard)
    @Roles(Role.USER)
    @Post('make-comment/:postid/:userid')
    async Makecomment(@Param('postid')postid:number, @Param('userid')userid:number,@Body()dto:CommentDto):Promise<{msg:string}>{
       try {
         return await this.cmsService.MakeAComment(postid,userid,dto)
       } catch (error) {
        throw error
        
       }
    }

    @Patch('edit-comment/:commentid/:userid')
    async editComment(@Param('id')commentid:number, @Param('id')userid:number, @Body()dto:CommentDto):Promise<{msg:string}>{
        try {
            return await this.cmsService.EditAComment(commentid,userid,dto)
        } catch (error) {
            throw error
            
        }
    }

    @UseGuards(RoleGuard)
    @Roles(Role.USER,Role.ADMIN)
    @Delete('delete-comment/:commentid/:userid')
    async DeleteComment(@Param('commentid')commentid:number, @Param('userid')userid:number):Promise<{msg:string}>{
        try {
            return await this.cmsService.deleteCommentPost(commentid,userid)
        } catch (error) {
            throw error
            
        }
    }


    @UseGuards(RoleGuard)
    @Roles(Role.USER)
    @Patch('like-a-comment/:commentid/:userid')
    async LikeComment(@Param('commentid')postid:number, @Param('userid')userid:number,@Body()dto:LikeDto):Promise<{msg:string}>{
        try {
            return await this.cmsService.LikeAComment(postid,userid,dto)
            
        } catch (error) {
            throw error
            
        }
        
    }

    



    //reply 
    @UseGuards(RoleGuard)
    @Roles(Role.USER)
    @Post('make-reply/:replyid/:userid')
    async ReplyAComment(@Param('replyid')replyid:number, @Param('userid')userid:number,@Body()dto:ReplyDto):Promise<{msg:string}>{
        try {
            return await this.cmsService.ReplyAComment(replyid,userid,dto)
        } catch (error) {
            throw error 
            
        }
    }

    @UseGuards(RoleGuard)
    @Roles(Role.USER)
    @Patch('edit-reply/:replyid/:userid')
    async editReply(@Param('replyid')replyid:number, @Param('iuserd')userid:number, @Body()dto:ReplyDto):Promise<{msg:string}>{
        try {
            return await this.cmsService.EditAReply(replyid,userid,dto)
        } catch (error) {
            throw error
            
        }
    }


    @UseGuards(RoleGuard)
    @Roles(Role.USER,Role.ADMIN)
    @Delete('delete-reply/:replyid/:userid')
    async DeleteReply(@Param('replyid')replyid:number, @Param('userid')userid:number):Promise<{msg:string}>{
        try {
            return await this.cmsService.deleteReply(replyid,userid)
        } catch (error) {
            throw error
            
        }
    }


    @UseGuards(RoleGuard)
    @Roles(Role.USER)
    @Patch('like-a-reply/:replyid/:userid')
    async LikeAReply(@Param('userid')userid:number, @Param('replyid')replyid:number,@Body()dto:LikeDto):Promise<{msg:string}>{
        try {
            return await this.cmsService.LikeAReply(replyid,userid,dto)
            
        } catch (error) {
            throw error
            
        }
        
    }
}