import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Comment } from 'src/comment/comment.model';

@Schema()
@ObjectType()
@Directive('@key(fields: "_id")')
export class File {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId;

  @Prop()
  @Field()
  bucket: string;

  @Prop()
  @Field()
  key: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], default: [] })
  @Field(() => [Comment])
  comments: mongoose.Schema.Types.ObjectId[];
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);
