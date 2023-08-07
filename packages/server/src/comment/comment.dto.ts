import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  fileId: string;

  @Field()
  userId: string;

  @Field()
  parentId?: string;

  @Field()
  content: string;
}
