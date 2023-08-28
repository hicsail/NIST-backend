import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  file: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field({ nullable: true })
  replyTo?: string;

  @Field()
  content: string;
}
