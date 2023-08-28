import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment, UserModel } from './comment.model';
import { CreateCommentInput } from './comment.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserContext } from 'src/auth/user.decorator';
import { TokenPayload } from 'src/auth/user.dto';
import { FileService } from 'src/file/file.service';
import { File } from 'src/file/file.model';

@Resolver(() => Comment)
@UseGuards(JwtAuthGuard)
export class CommentResolver {
  constructor(private commentService: CommentService, private fileService: FileService) {}

  @Mutation(() => Comment)
  async addComment(@UserContext() user: TokenPayload, @Args('input') input: CreateCommentInput): Promise<Comment> {
    return this.commentService.create(input, user.id);
  }

  @Mutation(() => Boolean)
  async deleteComment(@Args('id') id: string): Promise<boolean> {
    return this.commentService.removeComment(id);
  }

  @ResolveField('replies', () => [Comment])
  async getReplies(@Parent() comment: Comment): Promise<Comment[]> {
    return this.commentService.findByIds(comment.replies);
  }

  @ResolveField('file', () => File, { nullable: true })
  async getFile(@Parent() comment: Comment): Promise<File | null> {
    return this.fileService.findByFileId(comment.file);
  }

  @ResolveField('user', () => UserModel)
  resolveUser(@Parent() comment: Comment): any {
    return { __typename: 'UserModel', id: comment.user };
  }

  @ResolveField('replyTo', () => UserModel, { nullable: true })
  resolveReplyToUser(@Parent() comment: Comment): any {
    if (!comment.replyTo) return null;

    return { __typename: 'UserModel', id: comment.replyTo };
  }
}
