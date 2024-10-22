import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
import { UserSchema } from 'src/users/schema/user.schema';
import { RoleSchema } from 'src/roles/schema/role.schema';
import { FlowerSchema } from 'src/flowers/schema/flower.schema';
import { OrderSchema } from 'src/orders/schema/order.schema';
import { DeliverySchema } from 'src/delivery/schema/delivery.schema';
import { PaymentSchema } from 'src/payments/schema/payment.schema';
import { ReviewSchema } from 'src/reviews/schema/review.schema';
import { NotificationSchema } from 'src/notifications/schema/notification.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Role', schema: RoleSchema },
      { name: 'Flower', schema: FlowerSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'Delivery', schema: DeliverySchema },
      { name: 'Payment', schema: PaymentSchema },
      { name: 'Review', schema: ReviewSchema },
      { name: 'Notification', schema: NotificationSchema },
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
