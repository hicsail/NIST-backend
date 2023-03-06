import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { RequestMethod } from '@nestjs/common';
import JSON from 'graphql-type-json';

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

  @Field(() => JSON, { description: 'Raw HTTP request which is used to produce the AWS Signature. See AWS HttpRequest' })
  request: any;
}
