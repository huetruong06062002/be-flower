import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Thay đổi nếu cần thiết, hiện tại đang cho phép tất cả
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  async handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // Gửi thông báo đến một userId cụ thể
  async sendNotification(userId: string, message: string) {
    const notification = await this.notificationsService.createNotification(userId, message);
    
    // Gửi thông báo đến client dựa trên userId
    this.server.emit(`notification_${userId}`, notification);
  }
}
