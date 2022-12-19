import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DesignerDocument = HydratedDocument<Designer>;

@Schema()
export class Designer {
  @Prop()
  fio: string;

  @Prop()
  _id: number;
}

export const DesignerSchema = SchemaFactory.createForClass(Designer);
