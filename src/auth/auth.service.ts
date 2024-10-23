import { LoginDto } from './dto/login.dto';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';
import * as bycrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { RoleDocument } from 'src/roles/schema/role.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
     private userModel: SoftDeleteModel<UserDocument>,

     private jwtService: JwtService
  ) {

  }


  async signUp(signUpDto : SignUpDto){
    const  {name, email, password} = signUpDto;

          // Check if email already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bycrypt.hash(password, 10)

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      roleId : "671777da4c97c9d7010ce31d"
    })


    return {
      _id: user?._id,
      createdAt: user?.createdAt
    };


  }

  async login(LoginDto: LoginDto) {
    const { email, password } = LoginDto;

    const user = await this.userModel
      .findOne({ email })
      .populate('roleId', 'name') // Populate để lấy role name
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }


    const isPasswordMatch = await bycrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

     // Lấy roleName từ user đã populate
     const { _id, name, roleId } = user;
     const roleName = (roleId as any).name; 



     // Tạo JWT và trả về thông tin người dùng
     const payload = { _id, name, email, roleId, roleName };
     const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        _id,
        name,
        email,
        roleId,
        roleName, // Trả về roleName
      }
    }
  }

}
