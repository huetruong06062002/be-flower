// dto/create-chat-room.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChatRoomDto {
  @ApiProperty({ description: 'ID of the buyer' })
  @IsString()
  buyerId: string;

  @ApiProperty({ description: 'ID of the seller' })
  @IsString()
  sellerId: string;
}

