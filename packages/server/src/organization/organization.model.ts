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

  @Prop({ type: String, required: false })
  @Field(() => String, { nullable: true })
  owner: string | null;

  @Prop()
  @Field()
  bucket: string;

  @Prop()
  @Field()
  protocolBucket: string;

  @Prop()
  @Field()
  logoURL: string;
}

export type OrganizationDocument = Organization & Document;
export const OrganizationSchema = SchemaFactory.createForClass(Organization);
