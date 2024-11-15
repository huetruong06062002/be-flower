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



  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const { buyerId, flowerId } = createOrderDto;
    const flower = await this.flowerModel.findById(flowerId).exec();
    if (!flower) {
      throw new Error('Không tìm thấy thông tin hoa.');
    }

    let totalPrice;

    totalPrice = flower.price;

    const order = new this.orderModel({
      buyerId,
      flowerId,
      totalPrice,
      orderDate: new Date(),
      status: 'Đang xử lý',
    });

    await order.save();
    await flower.save();


    // Tạo thông báo cho người mua
    const message = `Đơn hàng của bạn đang được tạo với tổng tiền là: ${totalPrice}`;
    await this.notificationsService.createNotification(order.buyerId.toString(), message);

    // Gửi thông báo qua WebSocket
    await this.notificationsGateway.sendNotification(order.buyerId.toString(), message);
    return order;
  }

  async getOrderByBuyerId(buyerId: string) {
    try {
      // Tìm tất cả đơn hàng của buyerId và populate thông tin buyerId và flowerId
      const orders = await this.orderModel
        .find({ buyerId })
        .populate('buyerId flowerId')
        .exec();

      let totalOrderPrice = 0;

      // Tính tổng giá trị đơn hàng
      orders.forEach(order => {
        //@ts-ignore
        if (order.flowerId && order.flowerId.price) {
        //@ts-ignore
          totalOrderPrice += order.flowerId.price;
        }
      });

      // Trả về kết quả, bao gồm danh sách đơn hàng và tổng giá trị đơn hàng
      return {
        buyerId,
        orders,
        totalOrderPrice,
      };
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
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

    // Cập nhật trạng thái đơn hàng
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    await order.save(); // Lưu thay đổi của đơn hàng
    await flower.save(); // Lưu thay đổi của hoa

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
