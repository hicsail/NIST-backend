import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './comment.model';
import { CreateCommentInput } from './comment.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Mutation(() => Comment)
  async addComment(@Args('input') input: CreateCommentInput) {
    return this.commentService.create(input);
  }

  @Mutation(() => Comment)
  async deleteComment(@Args('id') id: string) {
    return this.commentService.removeComment(id);
  }
}
