import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { RequestMethod } from '@nestjs/common';

registerEnumType(RequestMethod, { name: 'RequestMethod' });

@InputType({ description: 'Bucket resource a user is attempting to access' })
export class ResourceRequest {
  @Field()
  account: string;

  @Field({ nullable: true })
  bucket: string | null;

  @Field({ nullable: true })
  object: string | null;

  @Field(() => RequestMethod)
  method: RequestMethod;
}
