import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFlowerDto } from './create-flower.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFlowerDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Tên hoa

  @IsString()
  @IsNotEmpty()
  type: string; // Loại hoa

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number) 
  quantity: number; // Số lượng hoa

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number) 
  price: number; // Giá hoa

  @IsString()
  @IsNotEmpty()
  condition: string; // Tình trạng hoa

  @IsString()
  @IsOptional()
  description?: string; // Mô tả hoa

  @ApiProperty({ type: 'string', format: 'binary', description: 'Hình ảnh của hoa' })
  file: any;

}