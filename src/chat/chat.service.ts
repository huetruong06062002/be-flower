import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoom, ChatRoomDocument } from './schema/chat-room.schema';
import { Message, MessageDocument } from 'src/message/schema/message.schema';
import { CreateChatRoomDto } from './dto/create-chat-rom.dto';
import { SendMessageDto } from './dto/send-mesage.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  // Tạo phòng chat mới giữa người mua và người bán
  async createChatRoom(createChatRoomDto: CreateChatRoomDto) {
    const { buyerId, sellerId } = createChatRoomDto;
    const chatRoom = new this.chatRoomModel({ buyerId, sellerId, createdAt: new Date() });
    return chatRoom.save();
  }

  // Gửi tin nhắn trong phòng chat
  async sendMessage(sendMessageDto: SendMessageDto) {
    const { chatRoomId, senderId, message } = sendMessageDto;
    const newMessage = new this.messageModel({
      chatRoomId,
      senderId,
      message,
      createdAt: new Date(),
    });
    return newMessage.save();
  }

  // Lấy tất cả tin nhắn trong một phòng chat
  async getMessages(chatRoomId: string) {
    return this.messageModel.find({ chatRoomId }).exec();
  }

    // Lấy tất cả các phòng chat
    async getAllChatRooms() {
      return this.chatRoomModel.find().exec();
    }

    
  // Tìm kiếm phòng chat theo buyerId và sellerId
  async findChatRoom(buyerId: Types.ObjectId, sellerId: Types.ObjectId) {
    return this.chatRoomModel.findOne({ buyerId, sellerId }).exec();
  }
}
