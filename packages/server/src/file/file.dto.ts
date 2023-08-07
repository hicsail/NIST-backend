import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFileInput {
  @Field()
  fileId: string;

  @Field()
  bucket: string;
}
