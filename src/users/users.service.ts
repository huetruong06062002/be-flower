import { BadRequestException, Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
