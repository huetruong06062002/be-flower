import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Review, ReviewDocument } from './schema/review.schema';


@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: SoftDeleteModel<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const createdReview = new this.reviewModel(createReviewDto);
    return createdReview.save();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel
      .find()
      .populate('userId') // Populate với thông tin của User
      .populate('flowerId') // Populate với thông tin của Flower
      .exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(id)
      .populate('userId')
      .populate('flowerId')
      .exec();

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .populate('userId')
      .populate('flowerId')
      .exec();

    if (!updatedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return updatedReview;
  }

  async remove(id: string): Promise<Review> {
    const review = await this.reviewModel.findByIdAndRemove(id).exec();

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }
}
