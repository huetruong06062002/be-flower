import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  orderId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop({ required: true })
  paymentStatus: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
