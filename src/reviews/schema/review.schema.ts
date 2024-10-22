import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Flower' })
  flowerId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  rating: number;

  @Prop()
  comment: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
