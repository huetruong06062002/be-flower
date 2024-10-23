import { LoginDto } from './dto/login.dto';
import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';
import * as bycrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { RoleDocument } from 'src/roles/schema/role.schema';
import { ProfileDto } from './dto/create-profile.dto';

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

  async createProfile(profileDto: ProfileDto, user: UserDocument) {
    const { name, address, phoneNumber } = profileDto;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Cập nhật thông tin người dùng
    user.name = name;
    user.address = address;
    user.phoneNumber = phoneNumber;

    // Cập nhật thông tin trong cơ sở dữ liệu
    const updateUser = await this.userModel.updateOne(
      { _id: user._id },  // Điều kiện cập nhật
      { $set: {            // Giá trị được cập nhật
          name: user.name,
          address: user.address,
          phoneNumber: user.phoneNumber,
        } 
      }
    );

    // Kiểm tra nếu việc cập nhật không thành công
    if (updateUser.modifiedCount === 0) {
      throw new Error('Failed to update user profile');
    }

    // Populate roleId để lấy roleName từ bảng role
    const populatedUser = await this.userModel.findById(user._id).populate('roleId').exec();

    // Lấy roleName từ user đã populate
    const { _id, name: userName, email, address: userAddress, phoneNumber: userPhoneNumber } = populatedUser;
    const role = populatedUser.roleId as any; // Đảm bảo roleId đã được populate

    if (!role || !role._id) {
      throw new Error('Role not found');
    }

    const roleName = role.name;

    // Tạo access token mới
    const accessToken = this.jwtService.sign({ id: _id });

    // Trả về thông tin người dùng đã được cập nhật và token mới
    return {
      message: 'Profile updated successfully',
      accessToken,
      user: {
        _id,
        name: userName,
        email,
        address: userAddress,
        phoneNumber: userPhoneNumber,
        roleId: role._id,   // Lấy roleId từ đối tượng role
        roleName            // Lấy roleName từ đối tượng role đã populate
      }
    };
   
  }

}
