import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: 'JWT Token' })
export class Token {
  @Field()
  token: string;
}
