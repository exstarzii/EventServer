import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ index: true, unique: true})
  nickname: string;
  @Prop({ unique: true})
  phone: string;
  @Prop()
  code : string;
  @Prop()
  failedLoginAttempt : number;
}

export const UserSchema = SchemaFactory.createForClass(User);
