import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './Users/user/user.module';
import { AdminModule } from './Users/admin/admin.module';
import { CmsModule } from './cms/cms.module';
import { TypeOrmInternalModule } from './TypeOrm/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmService } from './TypeOrm/typeorm.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AdminModule,
    CmsModule,
    TypeOrmModule.forRootAsync({useClass:TypeOrmService}),
    ConfigModule.forRoot({isGlobal:true}),
    MailerModule.forRoot({
      transport:{
        service:"gmail",
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
          user:process.env.AUTH_EMAIL,
          pass:process.env.AUTH_PASS
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
