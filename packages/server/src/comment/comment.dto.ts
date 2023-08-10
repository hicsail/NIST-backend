import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  file: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field()
  content: string;
}
