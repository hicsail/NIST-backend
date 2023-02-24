import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Organization } from '../organization/organization.model';

@Schema()
export class UserPermissions {
  @Prop({ description: 'ID of the user' })
  user: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Organization.name })
  org: mongoose.Types.ObjectId;
}

export type UserPermissionsDocument = UserPermissions & Document;
export const UserPermissionsSchema = SchemaFactory.createForClass(UserPermissions);
