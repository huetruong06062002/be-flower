import { Controller, Post, Get, Put, Delete, Param, Body, UploadedFile, UseInterceptors, Res, UseGuards, Req } from '@nestjs/common';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FlowersService } from './flowers.service';
import { Express } from 'express'
import { Response } from 'express';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { UpdateFlowerDto } from './dto/update-flower.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { multerOptions } from 'src/multer/multer.config';


@ApiTags('flowers')
@Controller('flowers')
export class FlowersController {
  constructor(private readonly flowersService: FlowersService) {}


 
  @Post()
  @UseGuards(AuthGuard('jwt')) 
  @UseInterceptors(
    FileInterceptor('file',multerOptions),
  )
  @ApiOperation({ summary: 'Create a new flower' })
  @ApiResponse({ status: 201, description: 'Flower created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiConsumes('multipart/form-data') // Đánh dấu là multipart/form-data
  @ApiBody({
    description: 'Flower information along with an image file',
    type: CreateFlowerDto,
    required: true,
    // Định nghĩa phần file
    schema: {
      type: 'object',
      properties: {
        // Các thuộc tính từ CreateFlowerDto
        name: { type: 'string' },
        type: { type: 'string' },
        quantity: { type: 'number' },
        price: { type: 'number' },
        condition: { type: 'string' },
        description: { type: 'string', nullable: true }, // nullable nếu không bắt buộc
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createFlower(
    @Body() flowerDto: CreateFlowerDto,
    @UploadedFile() file: Express.Multer.File, // Sử dụng Express.Multer.File
    @Req() req, 
  ) {
    const sellerId = req.user._id; 
    return this.flowersService.createFlower(flowerDto, file, sellerId);
  }


  @Get('/')
  async getAllFlowers() {
    return this.flowersService.getAllFlowers();
  }

  @Get('/:id')
  async getFlowerById(@Param('id') id: string) {
    return this.flowersService.getFlowerById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  @UseInterceptors(FileInterceptor('file', multerOptions)) // Sử dụng Multer để xử lý file upload
  @ApiOperation({ summary: 'Update a flower' })
  @ApiResponse({ status: 200, description: 'Flower updated successfully.' }) // Đổi về 200 thay vì 201
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiConsumes('multipart/form-data') // Đánh dấu là multipart/form-data
  @ApiBody({
    description: 'Flower information along with an image file',
    type: UpdateFlowerDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
        quantity: { type: 'number' },
        price: { type: 'number' },
        condition: { type: 'string' },
        description: { type: 'string', nullable: true }, // Đánh dấu là nullable
        file: {
          type: 'string',
          format: 'binary',
          nullable: true, // Đánh dấu là nullable
        },
      },
    },
  })
  async updateFlower(
    @Param('id') id: string, 
    @Body() flowerDto: UpdateFlowerDto, 
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.flowersService.updateFlower(id, flowerDto, file);
  }


  @UseGuards(AuthGuard('jwt')) 
  @Delete('/:id')
  async deleteFlower(@Param('id') id: string, @Req() req) {
    return this.flowersService.deleteFlower(id, req);
  }
}
