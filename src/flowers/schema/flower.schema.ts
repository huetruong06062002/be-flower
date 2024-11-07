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
  freshness: number; // Đếm ngược thời gian héo, có thể tính bằng số ngày còn lại

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  condition: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  unitType: string; // Đơn vị bán, ví dụ: 'chậu' hoặc 'bó'

  @Prop({ required: true })
  flowersPerUnit: number; // Số lượng bông hoa trong mỗi chậu hoặc bó

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sellerId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  imageUrl: string; // Đường dẫn URL đến ảnh

  @Prop()
  mediumRating?: number;

  // Thêm mảng chứa các review liên quan
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] })
  reviewId?: mongoose.Schema.Types.ObjectId[];
}

export const FlowerSchema = SchemaFactory.createForClass(Flower);
