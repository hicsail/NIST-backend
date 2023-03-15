import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Organization } from '../organization/organization.model';

@Schema()
@ObjectType()
export class UserPermissions {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId;

  @Prop({ description: 'ID of the user' })
  @Field()
  user: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Organization.name })
  @Field(() => Organization)
  org: mongoose.Types.ObjectId;

  @Prop()
  @Field()
  read: boolean;

  @Prop()
  @Field()
  write: boolean;

  @Prop()
  @Field()
  delete: boolean;

  @Prop()
  @Field()
  admin: boolean;
}

export type UserPermissionsDocument = UserPermissions & Document;
export const UserPermissionsSchema = SchemaFactory.createForClass(UserPermissions);
