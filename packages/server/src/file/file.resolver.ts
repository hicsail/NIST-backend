import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { File } from './file.model';
import { CreateFileInput } from './file.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Comment } from 'src/comment/comment.model';
import { CommentService } from 'src/comment/comment.service';

@Resolver(() => File)
@UseGuards(JwtAuthGuard)
export class FileResolver {
  constructor(private fileService: FileService, private commentService: CommentService) {}

  @Query(() => File)
  async getFileByFileId(@Args('fileId') fileId: string) {
    return this.fileService.findByFileId(fileId);
  }

  @Mutation(() => File)
  async addFile(@Args('input') input: CreateFileInput) {
    return this.fileService.create(input);
  }

  @Mutation(() => File)
  async deleteFile(@Args('fileId') fileId: string) {
    return this.fileService.removeFile(fileId);
  }

  @ResolveField('comments', () => [Comment])
  async getComments(@Parent() file: File) {
    return this.commentService.findByFileId(file.fileId);
  }
}
