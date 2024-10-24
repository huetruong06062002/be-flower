import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { Flower, FlowerSchema } from 'src/flowers/schema/flower.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Notification, NotificationSchema } from 'src/notifications/schema/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Flower.name, schema: FlowerSchema }]),
    NotificationsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
