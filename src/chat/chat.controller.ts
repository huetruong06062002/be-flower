import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatRoomDto } from './dto/create-chat-rom.dto';
import { SendMessageDto } from './dto/send-mesage.dto';
import { ChatRoom } from './schema/chat-room.schema';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create-room')
  @ApiOperation({ summary: 'Tạo phòng chat giữa người mua và người bán' })
  @ApiBody({ type: CreateChatRoomDto })
  @ApiResponse({ status: 201, description: 'Phòng chat đã được tạo thành công.' })
  async createChatRoom(@Body() createChatRoomDto: CreateChatRoomDto) {
    return await this.chatService.createChatRoom(createChatRoomDto);
  }

  @Post('send-message')
  @ApiOperation({ summary: 'Gửi tin nhắn trong phòng chat' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 201, description: 'Tin nhắn đã được gửi thành công.' })
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return await this.chatService.sendMessage(sendMessageDto);
  }

  @Get('messages/:chatRoomId')
  @ApiOperation({ summary: 'Lấy tất cả tin nhắn trong phòng chat' })
  @ApiParam({ name: 'chatRoomId', description: 'ID của phòng chat' })
  @ApiResponse({ status: 200, description: 'Danh sách tin nhắn.' })
  async getMessages(@Param('chatRoomId') chatRoomId: string) {
    return await this.chatService.getMessages(chatRoomId);
  }

  @Get('rooms')
  @ApiOperation({ summary: 'Lấy tất cả các phòng chat' })
  @ApiResponse({ status: 200, description: 'Danh sách các phòng chat.', type: [ChatRoom] })
  async getAllChatRooms() {
    return await this.chatService.getAllChatRooms();
  }
}
