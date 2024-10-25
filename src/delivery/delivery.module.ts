import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Delivery, DeliverySchema } from './schema/delivery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Delivery.name, schema: DeliverySchema }])
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService]
})
export class DeliveryModule {}
