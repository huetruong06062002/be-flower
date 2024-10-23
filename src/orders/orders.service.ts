import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Flower, FlowerDocument } from 'src/flowers/schema/flower.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Flower.name) private flowerModel: SoftDeleteModel<FlowerDocument>,


   

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
  
    // Cập nhật số lượng hoa và tổng tiền nếu cần
    if (updateOrderDto.quantity) {
      const flower = await this.flowerModel.findById(order.flowerId).exec();
      order.quantity = updateOrderDto.quantity;
      order.totalPrice = flower.price * updateOrderDto.quantity;
    }
  
    // Cập nhật trạng thái đơn hàng
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }
  
    await order.save();
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
