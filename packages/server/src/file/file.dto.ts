import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFileInput {
  @Field()
  bucket: string;

  @Field()
  key: string;
}
