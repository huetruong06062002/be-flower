import { IsNotEmpty, IsString, IsDate, IsMongoId, IsDateString } from 'class-validator';

export class CreateDeliveryDto {
  @IsMongoId()
  @IsNotEmpty({ message: 'Order ID is required.' })
  readonly orderId: string;

  @IsNotEmpty({ message: 'Delivery address is required.' })
  @IsString({ message: 'Delivery address must be a string.' })
  readonly deliveryAddress: string;

  @IsNotEmpty({ message: 'Delivery date is required.' })
  @IsDateString({},{ message: 'Delivery date must be a valid date string.' })
  readonly deliveryDate: Date;

  @IsNotEmpty({ message: 'Delivery status is required.' })
  @IsString({ message: 'Delivery status must be a string.' })
  readonly deliveryStatus: string;

  @IsMongoId()
  @IsNotEmpty({ message: 'Delivery person ID is required.' })
  readonly deliveryPersonId: string;
}
