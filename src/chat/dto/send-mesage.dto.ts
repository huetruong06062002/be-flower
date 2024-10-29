// dto/send-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ description: 'ID of the chat room' })
  @IsString()
  chatRoomId: string;

  @ApiProperty({ description: 'ID of the sender' })
  @IsString()
  senderId: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  message: string;
}
