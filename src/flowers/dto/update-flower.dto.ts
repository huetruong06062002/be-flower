import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFlowerDto } from './create-flower.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

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

  // Ẩn mediumRating khỏi Swagger khi cập nhật
  @ApiHideProperty()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ?? 0)
  mediumRating?: number; // Đánh giá trung bình, không bắt buộc

  @IsString()
  @IsNotEmpty()
  condition: string; // Tình trạng hoa

  @IsString()
  @IsOptional()
  description?: string; // Mô tả hoa


  // Optional file property
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', description: 'Hình ảnh của hoa', required: false, nullable: true })
  file?: any; // Hình ảnh của hoa, không bắt buộc


  // Thêm reviewId dưới dạng mảng ObjectId, tùy chọn
  @IsOptional()
  @ApiProperty({ type: [String], description: 'Danh sách review liên quan' })
  reviewId?: mongoose.Schema.Types.ObjectId[];

}