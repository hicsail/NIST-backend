import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './file.model';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';
import { Comment, CommentSchema } from 'src/comment/comment.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema },
      { name: Comment.name, schema: CommentSchema }
    ])
  ],
  providers: [FileService, FileResolver]
})
export class FileModule {}
