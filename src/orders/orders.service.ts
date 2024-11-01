import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Flower, FlowerDocument } from 'src/flowers/schema/flower.schema';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Flower.name) private flowerModel: SoftDeleteModel<FlowerDocument>,
    private readonly notificationsGateway: NotificationsGateway, // Inject NotificationsGateway
    private readonly notificationsService: NotificationsService, 

   

  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const {buyerId, flowerId, quantity} = createOrderDto;
    const flower = await this.flowerModel.findById(flowerId).exec();
    if (!flower || flower.quantity < quantity) {
      throw new Error('Không đủ số lượng hoa để đặt hàng.');
    }
  
    
    const totalPrice = flower.price * quantity;
  
    const order = new this.orderModel({
      buyerId,
      flowerId,
      quantity,
      totalPrice,
      orderDate: new Date(),
      status: 'Đang xử lý',
    });
  
    await order.save();
    flower.quantity -= quantity; // Cập nhật số lượng còn lại
    await flower.save();
    

      // Tạo thông báo cho người mua
      const message = `Đơn hàng của bạn đang được tạo với tổng tiền là: ${totalPrice}`;
      await this.notificationsService.createNotification(order.buyerId.toString(), message);
  
      // Gửi thông báo qua WebSocket
      await this.notificationsGateway.sendNotification(order.buyerId.toString(), message);
    return order;
  }

  async findAll(filter: any = {}) {
    return await this.orderModel.find(filter).populate('buyerId flowerId').exec();
  }

  async findOne(orderId: string) {
    return await this.orderModel.findById(orderId).populate('buyerId flowerId').exec();
  }

  async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      throw new Error('Đơn hàng không tồn tại.');
    }

    const flower = await this.flowerModel.findById(order.flowerId).exec();
    if (!flower) {
      throw new Error('Hoa không tồn tại.');
    }

    // Nếu cập nhật số lượng hoa
    if (updateOrderDto.quantity) {
      const quantityDifference = updateOrderDto.quantity - order.quantity;

      // Kiểm tra xem số lượng hoa có đủ để cập nhật hay không
      if (flower.quantity < quantityDifference) {
        throw new Error('Không đủ số lượng hoa để cập nhật đơn hàng.');
      }

      // Cập nhật số lượng và tổng tiền
      flower.quantity -= quantityDifference; // Cập nhật số lượng hoa
      order.quantity = updateOrderDto.quantity;
      order.totalPrice = flower.price * updateOrderDto.quantity;
    }

    // Cập nhật trạng thái đơn hàng
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    await order.save();
    await flower.save();

    // Tạo thông báo cho người mua
    const message = `Đơn hàng của bạn đang được: ${order.status}`;
    await this.notificationsService.createNotification(order.buyerId.toString(), message);

    // Gửi thông báo qua WebSocket
    await this.notificationsGateway.sendNotification(order.buyerId.toString(), message);

    return order;
  }

  async deleteOrder(orderId: string) {
    const order = await this.orderModel.findByIdAndDelete(orderId).exec();
    if (!order) {
      throw new Error('Đơn hàng không tồn tại.');
    }
    return order;
  }
  
}
