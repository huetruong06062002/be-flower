import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { DatabaseModule } from './database/database.module';
import { RolesModule } from './roles/roles.module';
import { FlowersModule } from './flowers/flowers.module';
import { DeliveryModule } from './delivery/delivery.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import mongoose from 'mongoose';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UsersModule, 
    AuthModule, DatabaseModule,  RolesModule, FlowersModule, DeliveryModule, PaymentsModule, ReviewsModule, NotificationsModule, OrdersModule, ChatModule, MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit{
  async onModuleInit() {
    const connection = mongoose.connection;
    connection.on('connected', () => {
      console.log('MongoDB connected successfully!');
    });
    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
  }
}
