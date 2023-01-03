import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  authorId: string;
  @Prop()
  roomId: string;
  @Prop()
  text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
