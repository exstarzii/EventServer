import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SysRequestDocument = HydratedDocument<SysRequest>;

@Schema()
export class SysRequest {
  @Prop()
  name: string;

  @Prop()
  designer_id: number;
}

export const SysRequestSchema = SchemaFactory.createForClass(SysRequest);
