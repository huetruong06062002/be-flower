import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageService } from '../message/message.service';
import { Types } from 'mongoose';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService, private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  @ApiOperation({ summary: 'Client joins a chat room' })
  @ApiBody({ schema: { type: 'string', example: 'chatRoomId' } })
  async handleJoinRoom(@MessageBody() chatRoomId: string, @ConnectedSocket() client: Socket) {
    client.join(chatRoomId);
    console.log(`Client ${client.id} joined room ${chatRoomId}`);
  }

  @SubscribeMessage('sendMessage')
  @ApiOperation({ summary: 'Client sends a message to a chat room' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chatRoomId: { type: 'string', example: '614c1b5f4e1c2b6e4b8a2d9a' },
        senderId: { type: 'string', example: '614c1b5f4e1c2b6e4b8a2d9b' },
        message: { type: 'string', example: 'Hello, everyone!' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  async handleSendMessage(
    @MessageBody() data: { chatRoomId: string; senderId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId, senderId, message } = data;
    const savedMessage = await this.messageService.saveMessage(new Types.ObjectId(chatRoomId), new Types.ObjectId(senderId), message);

    // Gửi tin nhắn đến các client khác trong phòng
    this.server.to(chatRoomId).emit('receiveMessage', savedMessage);
  }
}
