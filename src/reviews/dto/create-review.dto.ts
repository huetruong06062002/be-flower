import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  flowerId: string;

  @IsNotEmpty()
  @IsNumber()
  readonly rating: number;

  @IsOptional()
  @IsString()
  readonly comment?: string;

  @IsNotEmpty()
  readonly createdAt: Date;
}
