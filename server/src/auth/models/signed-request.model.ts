import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: 'Signed Request for a user to access a resource' })
export class SignedRequest {
  @Field({ description: 'If the user has been granted access, the other fields are only populated if this is true' })
  authorized: boolean;

  @Field({ description: 'The AWS signature', nullable: true })
  signature: string | undefined;

  @Field({ description: 'SHA256 hash of the body', nullable: true })
  hash: string | undefined;
}
