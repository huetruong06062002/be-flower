import { Module } from '@nestjs/common';
import { FlowersService } from './flowers.service';
import { FlowersController } from './flowers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Flower, FlowerSchema } from './schema/flower.schema';
import { Review, ReviewSchema } from 'src/reviews/schema/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Flower.name, schema: FlowerSchema },
      { name: Review.name, schema: ReviewSchema }, 
    ]),
    
  ],
  controllers: [FlowersController],
  providers: [FlowersService]
})
export class FlowersModule {}
