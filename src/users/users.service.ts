import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,


   

  ) {}

    // Password hashing utility
    hashPassword = (password: string): string => {
      const salt = genSaltSync(10);
      return hashSync(password, salt);
    };


  // Register a new user
  async register(registerUserDTO: CreateUserDto) {
    const { name, email, password, phoneNumber, address } = registerUserDTO;

    // Check if the email already exists
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
    }

    const hashPassword = this.hashPassword(password);
    const newRegister = await this.userModel.create({
     ...registerUserDTO,
     password: hashPassword,
    });

    return newRegister;
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
