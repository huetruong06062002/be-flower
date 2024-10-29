import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import * as bycrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}



  // Register a new user
  async register(registerUserDTO: CreateUserDto) {
    const { name, email, password, phoneNumber, address, roleId } = registerUserDTO;

    // Kiểm tra xem email đã tồn tại chưa
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
    }

    // Hash mật khẩu
    const hashedPassword = await bycrypt.hash(password, 10)

    console.log("hashedPassword", hashedPassword)
    // Tạo đối tượng user mới với mật khẩu đã được hash
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword, // Lưu mật khẩu đã hash
      phoneNumber,
      address,
      roleId,
    });

    // Lưu user mới vào cơ sở dữ liệu
    await newUser.save();

    return newUser;
  }

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.userModel.create({
      ...createUserDto
    });
  
    return {
      _id: createdUser._id,
      createdAt: createdUser.createdAt,
    };
  }

   // Lấy danh sách tất cả các user chưa bị xóa mềm
   async findAll() {
    return await this.userModel.find({ isDeleted: false }).select("-password").exec();
  }

 
  // Tìm user theo ID, chỉ trả về nếu chưa bị xóa mềm
  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id}).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found or has been deleted`);
    }
    return user;
  }

  // Cập nhật thông tin user
  async update(id: string, updateUserDto: UpdateUserDto) {
    const hashedPassword = await bycrypt.hash(updateUserDto.password, 10)
    const updatedUser = await this.userModel.findByIdAndUpdate(id, {...updateUserDto, password:hashedPassword }, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

   // Xóa mềm (soft delete) user theo ID
   async remove(id: string) {
    const user = await this.userModel.softDelete({ _id: id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User with ID ${id} has been soft deleted` };
  }


   // Khôi phục user đã xóa mềm
   async restore(id: string) {
    const user = await this.userModel.restore({ _id: id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found or is not soft deleted`);
    }
    return { message: `User with ID ${id} has been restored` };
  }
}
