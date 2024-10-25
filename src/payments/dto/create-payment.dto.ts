import { IsNotEmpty, IsString, IsMongoId, IsDateString } from 'class-validator';

export class CreatePaymentDto {
  @IsMongoId()
  @IsNotEmpty({ message: 'Order ID is required.' })
  readonly orderId: string;

  @IsNotEmpty({ message: 'Payment method is required.' })
  @IsString({ message: 'Payment method must be a string.' })
  readonly paymentMethod: string;

  @IsNotEmpty({ message: 'Payment date is required.' })
  @IsDateString({}, { message: 'Payment date must be a valid date string.' })
  readonly paymentDate: Date;

  @IsNotEmpty({ message: 'Payment status is required.' })
  @IsString({ message: 'Payment status must be a string.' })
  readonly paymentStatus: string;
}
