import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { File } from 'src/file/file.model';

@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@extends')
export class UserModel {
  @Field(() => ID)
  @Directive('@external')
  id: string;
}

@Schema()
@ObjectType()
@Directive('@key(fields: "_id")')
export class Comment {
  @Field(() => ID)
  _id: mongoose.Schema.Types.ObjectId;

  // refer to fileId in file.model.ts, NOT _id
  @Prop({ required: true })
  @Field(() => File, { description: "UUID of the file which is fileId in file's model" })
  file: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false })
  @Field(() => ID, { nullable: true })
  parentId: mongoose.Schema.Types.ObjectId | null;

  @Prop()
  @Field(() => UserModel, { description: 'ID of the user from the Auth Microservice' })
  user: string;

  @Prop({ required: false })
  @Field(() => UserModel, { nullable: true, description: 'ID of the user from the Auth Microservice' })
  replyTo: string;

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
