import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './comment.model';
import { CreateCommentInput } from './comment.dto';

@Resolver()
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Mutation(() => Comment)
  async addComment(@Args('input') input: CreateCommentInput) {
    return this.commentService.create(input);
  }
}
