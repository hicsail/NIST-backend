import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  fileId: string;

  @Field()
  user: string;

  @Field()
  parentId?: string;

  @Field()
  content: string;
}
