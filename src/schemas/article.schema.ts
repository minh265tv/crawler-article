import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Article extends Document {
  @Prop({required: true})
  title: string;

  @Prop()
  description: string;

  @Prop({required: true})
  content: string;

  @Prop()
  url: string;

  @Prop({ type: Types.ObjectId , ref: 'Topic' })
  topic: Types.ObjectId;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);