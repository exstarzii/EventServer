import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop()
  text: string;
  @Prop({type: mongoose.Schema.Types.Date})
  date: string;
  @Prop()
  image: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: string;
  @Prop([{ type: mongoose.Types.ObjectId, ref: 'User' }])
  likes: [mongoose.Types.ObjectId];
}

export const PostSchema = SchemaFactory.createForClass(Post);