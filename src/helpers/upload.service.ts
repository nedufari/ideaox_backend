import { BadRequestException, Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as fs from 'fs';
import * as fileType from 'file-type';
import {  UnsupportedMediaTypeException } from "@nestjs/common";


@Injectable()
export class UploadService{
    constructor(){}



async uploadFile  (file: Express.Multer.File): Promise<string>{
    const extension = extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif','.mp4', '.ogg', 'webm'];
    const maxVideoLengthInSeconds = 120;

const isSupportedVideoType = (mime: string) => {
    return mime.startsWith('video/') && ['mp4', 'ogg', 'webm'].includes(mime.split('/')[1]);
};

    if (!allowedExtensions.includes(extension)) {
        throw new BadRequestException(
            'Only files with the following extensions are allowed: ' +
            allowedExtensions.join(', '),
        );
    }

    const fileInfo = await fileType.fromBuffer(file.buffer);

    if (!fileInfo) {
        throw new UnsupportedMediaTypeException('Unrecognized file format');
    }

    if (fileInfo.mime.startsWith('image/')) {
        if (!fs.existsSync('public')) {
            fs.mkdirSync('public');
        }

        const filename = uuidv4() + extension;
        const filePath = `public/${filename}`;

        const writeStream = fs.createWriteStream(filePath);
        writeStream.write(file.buffer);
        writeStream.end();

        return filename;
    } else if (isSupportedVideoType(fileInfo.mime)) {

        if (file.buffer.length > maxVideoLengthInSeconds * 1024 * 1024) {
            throw new BadRequestException(`Video length exceeds ${maxVideoLengthInSeconds} seconds`);
        }
        
        if (!fs.existsSync('public/videos')) {
            fs.mkdirSync('public/videos');
        }

        const filename = uuidv4() + extension;
        const filePath = `public/videos/${filename}`;

        const writeStream = fs.createWriteStream(filePath);
        writeStream.write(file.buffer);
        writeStream.end();

        return filename;
    } else {
        throw new BadRequestException('Only image and video files are allowed');
    }
}
}