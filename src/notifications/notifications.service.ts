import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schema/notification.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: SoftDeleteModel<NotificationDocument>,
  ) {}

  // Tạo thông báo mới
  async createNotification(userId: string, message: string): Promise<Notification> {
    const newNotification = new this.notificationModel({
      userId,
      message,
      createdAt: new Date(),
    });
    return newNotification.save();
  }

  // Lấy danh sách thông báo chưa đọc của một người dùng
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId, isRead: false }).exec();
  }

  // Đánh dấu thông báo đã đọc
  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
  }
}
