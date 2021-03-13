import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Topic extends Document {

  @Prop({required: true})
  title: string;

  @Prop({required: true})
  slug: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);