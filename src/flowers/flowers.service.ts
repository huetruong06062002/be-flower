import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Flower, FlowerDocument } from './schema/flower.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { UpdateFlowerDto } from './dto/update-flower.dto';
import { Multer } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FlowersService {
  constructor(@InjectModel(Flower.name) private flowerModel: SoftDeleteModel<FlowerDocument>) {}

  async createFlower(flowerDto: CreateFlowerDto, file: Express.Multer.File,  sellerId: string,) {
    const flowerData = {
      ...flowerDto,
      imageUrl: `public/flower/${file.filename}`, // Lưu đường dẫn hình ảnh
      sellerId, 
    };

    const newFlower = new this.flowerModel(flowerData);
    return await newFlower.save();
  }

    // Lấy tất cả hoa, bao gồm cả thông tin seller
    async getAllFlowers(): Promise<Flower[]> {
      const flowers = await this.flowerModel
        .find()
        .populate('sellerId', 'name') // Lấy thông tin tên người bán từ User
        .exec();
  
      // Điều chỉnh imageUrl
      return flowers.map(flower => ({
        ...flower.toObject(),
      }));
    }

  // Lấy hoa theo ID, bao gồm cả seller
  async getFlowerById(id: string): Promise<Flower> {
    const flower = await this.flowerModel
      .findById(id)
      .populate('sellerId', 'name') // Lấy tên của seller
      .exec();

    if (flower) {
      const flowerData = flower.toObject();
      return flowerData;
    }

    return null;
  }

  // Cập nhật thông tin hoa kèm theo ảnh nếu cóm
  async updateFlower(id: string, flowerDto: UpdateFlowerDto, file?: Express.Multer.File) {
    const existingFlower = await this.flowerModel.findById(id).exec();

    if (!existingFlower) {
      throw new NotFoundException('Flower not found'); // Xử lý trường hợp không tìm thấy hoa
    }

    // Nếu có file ảnh mới, xóa ảnh cũ và lưu ảnh mới
    if (file) {
      console.log('Uploaded file:', file); // Log file để kiểm tra
      console.log('File filename:', file.filename); // Log filename để kiểm tra

      // Xóa ảnh cũ nếu có
      const oldImageUrl = existingFlower.imageUrl; // Lấy đường dẫn ảnh cũ
      if (oldImageUrl) {
        const oldImagePath = path.join(__dirname, '..', '..', oldImageUrl); // Đường dẫn đến ảnh cũ
        console.log("oldImageUrl:", oldImageUrl);
        
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Xóa ảnh cũ
          console.log(`Deleted old image at path: ${oldImagePath}`);
        }
      }

      // Cập nhật đường dẫn ảnh mới
      existingFlower.imageUrl = `public/flower/${file.filename}`; // Sử dụng file.filename để lưu ảnh mới
    }

    // Cập nhật các thông tin khác từ flowerDto
    existingFlower.name = flowerDto.name || existingFlower.name;
    existingFlower.type = flowerDto.type || existingFlower.type;
    existingFlower.quantity = flowerDto.quantity || existingFlower.quantity;
    existingFlower.price = flowerDto.price || existingFlower.price;
    existingFlower.condition = flowerDto.condition || existingFlower.condition;
    existingFlower.description = flowerDto.description || existingFlower.description;

    // Lưu lại thay đổi vào cơ sở dữ liệu
    await existingFlower.save();

    return {
      ...existingFlower.toObject(),
      imageUrl: existingFlower.imageUrl, // Trả về đường dẫn đầy đủ của ảnh mới
    };
  }
  

  // Xóa mềm hoa (soft delete)
  async deleteFlower(id: string, req: any) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return `not found flowers`;

    await this.flowerModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: req.user._id,
          email: req.user.email,
        },
      }
    );
    
    return await this.flowerModel.softDelete({ _id: id })
  }
}
