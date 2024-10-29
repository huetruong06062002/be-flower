import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatRoomDocument = ChatRoom & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ChatRoom {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  buyerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  sellerId: Types.ObjectId;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
