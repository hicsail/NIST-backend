import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment, UserModel } from './comment.model';
import { CreateCommentInput } from './comment.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UserContext } from 'src/auth/user.decorator';
import { TokenPayload } from 'src/auth/user.dto';

@Resolver(() => Comment)
@UseGuards(JwtAuthGuard)
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Mutation(() => Comment)
  async addComment(@UserContext() user: TokenPayload, @Args('input') input: CreateCommentInput) {
    return this.commentService.create(input, user.id);
  }

  @Mutation(() => Comment)
  async deleteComment(@Args('id') id: string) {
    return this.commentService.removeComment(id);
  }

  @ResolveField('replies', () => [Comment])
  async getReplies(@Parent() comment: Comment): Promise<Comment[]> {
    return this.commentService.findByIds(comment.replies);
  }

  @ResolveField('user', () => UserModel)
  resolveUser(@Parent() comment: Comment): any {
    return { __typename: 'UserModel', id: comment.user };
  }
}
