import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@Schema()
@ObjectType()
@Directive('@key(fields: "_id")')
export class Organization {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId;

  @Prop()
  @Field()
  name: string;

  @Prop()
  @Field()
  owner: string | null;

  @Prop()
  @Field()
  bucket: string;
}

export type OrganizationDocument = Organization & Document;
export const OrganizationSchema = SchemaFactory.createForClass(Organization);
