import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  buyerId: string;

  @IsNotEmpty()
  @IsString()
  flowerId: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number) 
  quantity: number; // Số lượng hoa
}

