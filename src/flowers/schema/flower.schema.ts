import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type FlowerDocument = HydratedDocument<Flower>;

@Schema()
export class Flower {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  condition: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sellerId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  imageUrl: string; // Đường dẫn URL đến ảnh
}

export const FlowerSchema = SchemaFactory.createForClass(Flower);
