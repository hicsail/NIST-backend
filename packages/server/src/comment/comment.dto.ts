import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  bucket: string;

  @Field()
  key: string;

  @Field()
  userId: string;

  @Field()
  parentId?: string;

  @Field()
  content: string;
}
