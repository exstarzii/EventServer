import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop()
  name: string;
  @Prop()
  dateStart: string;
  @Prop()
  dateEnd: string;
  @Prop()
  category: string;
  @Prop()
  location: string;
  @Prop()
  images: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: string;
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  participants: string;
  @Prop()
  description: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
