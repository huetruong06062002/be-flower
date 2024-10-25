import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateFlowerDto {
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

  @ApiProperty({ type: 'string', format: 'binary', description: 'Hình ảnh của hoa', nullable: true  })
  file: any;

   // Thêm reviewId dưới dạng mảng ObjectId, tùy chọn
   @IsOptional()
   @ApiProperty({ type: [String], description: 'Danh sách review liên quan' })
   reviewId?: mongoose.Schema.Types.ObjectId[];

}
