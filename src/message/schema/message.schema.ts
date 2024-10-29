import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Message {
  @Prop({ type: Types.ObjectId, required: true, ref: 'ChatRoom' })
  chatRoomId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  senderId: Types.ObjectId;

  @Prop({ required: true })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
