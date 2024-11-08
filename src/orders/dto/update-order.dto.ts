import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  status?: string; // Các trạng thái có thể là: "Đang xử lý", "Đã giao", "Đã hủy"
}
