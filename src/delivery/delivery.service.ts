import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Delivery, DeliveryDocument } from './schema/delivery.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';


@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: SoftDeleteModel<DeliveryDocument>,
  ) {}

  // Tạo mới một đơn giao hàng
  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const createdDelivery = new this.deliveryModel(createDeliveryDto);
    return await createdDelivery.save();
  }

  // Lấy tất cả các đơn giao hàng
  async findAll(): Promise<Delivery[]> {
    return this.deliveryModel.find().populate('orderId').populate('deliveryPersonId').exec();
  }

  // Lấy chi tiết một đơn giao hàng theo ID
  async findOne(id: string): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(id).populate('orderId').populate('deliveryPersonId').exec();
    if (!delivery) {
      throw new NotFoundException(`Delivery with id ${id} not found`);
    }
    return delivery;
  }

  // Cập nhật đơn giao hàng theo ID
  async update(id: string, updateDeliveryDto: UpdateDeliveryDto): Promise<Delivery> {
    const existingDelivery = await this.deliveryModel.findByIdAndUpdate(id, updateDeliveryDto, { new: true }).exec();
    if (!existingDelivery) {
      throw new NotFoundException(`Delivery with id ${id} not found`);
    }
    return existingDelivery;
  }

  // Xóa đơn giao hàng theo ID
  async remove(id: string): Promise<void> {
    const result = await this.deliveryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Delivery with id ${id} not found`);
    }
  }
}
