import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';


@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async saveMessage(chatRoomId: Types.ObjectId, senderId: Types.ObjectId, message: string) {
    const newMessage = new this.messageModel({ chatRoomId, senderId, message });
    return newMessage.save();
  }

  async getMessages(chatRoomId: Types.ObjectId) {
    return this.messageModel.find({ chatRoomId }).sort({ createdAt: 1 }).exec();
  }
}
