import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
@ObjectType()
@Directive('@key(fields: "_id")')
export class Comment {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId;

  @Prop()
  @Field()
  userId: string;

  @Prop({ type: Date, required: true, default: Date.now })
  @Field()
  date: Date;

  @Prop()
  @Field()
  content: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], default: [] })
  @Field(() => [Comment])
  replies: mongoose.Schema.Types.ObjectId[];
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
