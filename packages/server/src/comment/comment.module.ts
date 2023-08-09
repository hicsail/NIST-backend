import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comment.model';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { File, FileSchema } from 'src/file/file.model';
import { FileService } from 'src/file/file.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: File.name, schema: FileSchema }
    ])
  ],
  providers: [CommentService, CommentResolver, FileService]
})
export class CommentModule {}
