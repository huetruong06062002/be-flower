import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
  freshness: number;


  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number; // Giá hoa

  @IsString()
  @IsNotEmpty()
  condition: string; // Tình trạng hoa

  
  @IsString()
  @IsNotEmpty()
  unitType: string; // Tình trạng hoa

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  flowersPerUnit: number; 

  // Ẩn mediumRating khỏi Swagger khi tạo và cập nhật
  @ApiHideProperty()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ?? 0)
  mediumRating?: number; // Đánh giá trung bình, không bắt buộc

  @IsString()
  @IsOptional()
  description?: string; // Mô tả hoa

  @ApiProperty({ type: 'string', format: 'binary', description: 'Hình ảnh của hoa', nullable: true })
  file: any;

  // Thêm reviewId dưới dạng mảng ObjectId, tùy chọn
  @IsOptional()
  @ApiProperty({ type: [String], description: 'Danh sách review liên quan' , default: []})
  reviewId?: mongoose.Schema.Types.ObjectId[];

}
