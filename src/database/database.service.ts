import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/roles/schema/role.schema';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectModel('Role') private readonly roleModel: Model<Role>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedUsers();
  }

  private async seedRoles() {
    const rolesCount = await this.roleModel.countDocuments();
    if (rolesCount === 0) {
      await this.roleModel.insertMany([
        { name: 'Buyer', description: 'Người mua' },
        { name: 'Seller', description: 'Người bán' },
        { name: 'Admin', description: 'Quản trị viên' },
      ]);
      console.log('Roles seeded');
    }
  }

  private async seedUsers() {
    const usersCount = await this.userModel.countDocuments();
    if (usersCount === 0) {
      const adminRole = await this.roleModel.findOne({ name: 'Admin' });
      await this.userModel.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashed_password',
        address: 'Admin Address',
        phoneNumber: '123456789',
        roleId: adminRole._id,
      });
      console.log('Admin user seeded');
    }
  }
}
