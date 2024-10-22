import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type DeliveryDocument = HydratedDocument<Delivery>;

@Schema()
export class Delivery {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  orderId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  deliveryAddress: string;

  @Prop({ required: true })
  deliveryDate: Date;

  @Prop({ required: true })
  deliveryStatus: string;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
