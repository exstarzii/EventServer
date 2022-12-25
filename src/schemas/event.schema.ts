import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop()
  name: string;
  @Prop({type: mongoose.Schema.Types.Date})
  dateStart: string;
  @Prop({type: mongoose.Schema.Types.Date})
  dateEnd: string;
  @Prop()
  category: string;
  @Prop({
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
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


// export class Event {
//   name: string;
//   dateStart: string;
//   dateEnd: string;
//   category: string;
//   location: {    
//     type: String,
//     coordinates: Number[],
//   };
//   images: string;
//   author: string;
//   participants: string;
//   description: string;
// }

//  let sh= new mongoose.Schema({
//   name: String,
//   dateStart: String,
//   dateEnd: String,
//   category: String,
//   location: {
//     type: {
//       type: String, // Don't do `{ location: { type: String } }`
//       enum: ['Point'], // 'location.type' must be 'Point'
//       required: true,
//     },
//     coordinates: {
//       type: [Number],
//       required: true,
//     },
//   },
//   images: String,
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   description: String,
// });
// sh.index({ location: '2dsphere' });
// export const EventSchema = sh;
