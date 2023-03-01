import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PermissionChange {
  @Field({ nullable: true })
  read: boolean | null;

  @Field({ nullable: true })
  write: boolean | null;

  @Field({ nullable: true })
  delete: boolean | null;

  @Field({ nullable: true })
  admin: boolean | null;
}
