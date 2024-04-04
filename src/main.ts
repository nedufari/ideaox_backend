import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from "cors"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1/ideabox")
  app.useGlobalPipes(new ValidationPipe)
  // app.enableCors({origin:["*"]})
  app.use(cors({origin:"*"}))
 
  await app.listen(3000);
}
bootstrap();
