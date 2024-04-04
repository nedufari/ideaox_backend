import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'this is the official api for the IDEABOX web application!';
  }
}
