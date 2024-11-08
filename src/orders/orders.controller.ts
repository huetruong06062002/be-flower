import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from './schema/order.schema';



@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('getOrderByBuyerId')
  @ApiOperation({ summary: 'Lấy đơn hàng theo buyerId và tính tổng giá trị đơn hàng' })
  @ApiQuery({ name: 'buyerId', required: true, type: String, description: 'ID của Buyer' }) 
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng của Buyer và tổng giá trị đơn hàng', type: [Order] })
  @ApiResponse({ status: 500, description: 'Lỗi trong quá trình lấy dữ liệu' })
  async getOrderByBuyerId(@Query('buyerId') buyerId: string) {
    return this.ordersService.getOrderByBuyerId(buyerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  async updateOrder(@Param('id') orderId: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(orderId, updateOrderDto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') orderId: string) {
    return this.ordersService.deleteOrder(orderId);
  }
}
