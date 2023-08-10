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

  @Query(() => File, { nullable: true })
  async getFileByFileId(@Args('fileId') fileId: string): Promise<File | null> {
    return this.fileService.findByFileId(fileId);
  }

  @Mutation(() => File)
  async addFile(@Args('input') input: CreateFileInput): Promise<File> {
    return this.fileService.create(input);
  }

  @Mutation(() => Boolean)
  async deleteFile(@Args('fileId') fileId: string): Promise<boolean> {
    return this.fileService.removeFile(fileId);
  }

  @ResolveField('comments', () => [Comment])
  async getComments(@Parent() file: File): Promise<Comment[]> {
    return this.commentService.findByFile(file.fileId);
  }
}
