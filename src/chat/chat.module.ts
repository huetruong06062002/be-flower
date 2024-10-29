import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRoom, ChatRoomSchema } from './schema/chat-room.schema';
import { Message, MessageSchema } from 'src/message/schema/message.schema';
import { MessageModule } from 'src/message/message.module';
import { ChatController } from './chat.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),

    MessageModule
  ],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
