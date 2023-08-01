import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class JupyterHubUser {
  /**
   * The "name" of the user, this is really the ID of the user as collected
   * from the auth service, so assumed to be unique.
   */
  @Prop()
  name: string;

  /** Read access token for notebooks */
  @Prop()
  token: string;
}

export type JupyterHubUserDocument = JupyterHubUser & Document;
export const JupyterHubUserSchema = SchemaFactory.createForClass(JupyterHubUser);
