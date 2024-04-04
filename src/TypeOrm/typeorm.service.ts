import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AdminEntity } from 'src/Entity/admin.entity';
import { CommentsEntity } from 'src/Entity/comment.entity';
import { IdeaEntity } from 'src/Entity/idea.entity';
import { Notifications } from 'src/Entity/notification.entity';
import { UserOtp } from 'src/Entity/otp.entity';
import { RepliesEntity } from 'src/Entity/reply.entity';
import { UserEntity } from 'src/Entity/user.entity';

@Injectable()
export class TypeOrmService {
  constructor(private configservice: ConfigService) {}

  //configure the typeorm service here
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.configservice.get('DATABASE_HOST'),
      port: this.configservice.get('DATABASE_PORT'),
      username: this.configservice.get('DATABASE_USERNAME'),
      password: String(this.configservice.get('DATABASE_PASSWORD')),
      database: this.configservice.get('DATABASE_NAME'),
      synchronize: true,
      logging: false,
      entities: [
        AdminEntity,
        UserEntity,
        IdeaEntity,
        CommentsEntity,
        RepliesEntity,
        Notifications,
        UserOtp,
      ],
      migrations: [],
      subscribers: [],
      
      
    };
    
  }
}
