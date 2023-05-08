import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

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

  @Prop()
  name : string;
  @Prop()
  surename : string;
  @Prop()
  email : string;
  @Prop()
  sex : string;
  @Prop()
  age : number;
  @Prop()
  city : string;
  @Prop()
  about : string;
  @Prop()
  photo :string;
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  friends: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
