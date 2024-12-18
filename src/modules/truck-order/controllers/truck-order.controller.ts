import { TruckOrderDto, TruckOrderQueryDto } from "../dto/truck-order.dto";
import { TruckOrderService } from "../services/truck-order.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, Response } from "@nestjs/common";
import { truckOrderSchema, updatePriceSchema, updateRfqStatusSchema, updateStatusSchema } from "../validations/truck-order.validation";
import { YupValidationPipe } from "src/shared/pipes/yup-validation.pipe";

@Controller('truck-order')
export class OrderController {
  constructor(private readonly truckOrderService: TruckOrderService) { }

  @Get()
  async getAll(
    @Query() query: TruckOrderQueryDto,
    @Response() res,
  ): Promise<[]> {
    const data = await this.truckOrderService.getAllOrders(query);
    return res.status(200).json({
      message: 'Truck Orders fetched successfully',
      data,
      statusCode: 200,
    });
  }

  @Get('get-truck-orders-count')
  async getTruckOrdersCount(
    @Query() query: TruckOrderQueryDto,
    @Response() res,
  ): Promise<[]> {
    const data = await this.truckOrderService.getTruckOrdersCount(query)
    return res.status(200).json({
      message: 'Truck Orders count fetched successfully',
      data,
      statusCode: 200,
    });
  }

  @Get(':truckOrderId')
  async getOne(
    @Param() param,
    @Response() res,
  ): Promise<[]> {
    const { truckOrderId } = param
    const data = await this.truckOrderService.getOneOrder(truckOrderId);
    return res.status(200).json({
      message: 'Truck Order fetched successfully',
      data,
      statusCode: 200,
    });
  }

  @Post()
  async create(
    @Request() req,
    @Body(new YupValidationPipe(truckOrderSchema)) body: TruckOrderDto,
    @Response() res,
  ): Promise<[]> {
    const { user } = req
    const data = await this.truckOrderService.createNewOrder(body, user);
    return res.status(200).json({
      message: 'Order created successfully',
      data,
      statusCode: 200,
    });
  }

  @Patch('status/:truckOrderId')
  async updateStatus(
    @Param() param,
    @Body(new YupValidationPipe(updateStatusSchema)) body: TruckOrderDto,
    @Response() res,
  ): Promise<[]> {
    const { truckOrderId } = param
    const data = await this.truckOrderService.updateStatusOrder(truckOrderId, body);
    return res.status(200).json({
      message: 'Order status update successfully',
      data,
      statusCode: 200,
    });
  }

  @Patch('status/rfq/:truckOrderId')
  async updateRfqStatus(
    @Param() param,
    @Body(new YupValidationPipe(updateRfqStatusSchema)) body: TruckOrderDto,
    @Response() res,
  ): Promise<[]> {
    const { truckOrderId } = param
    const data = await this.truckOrderService.updateStatusOrder(truckOrderId, body);
    return res.status(200).json({
      message: 'Order status update successfully',
      data,
      statusCode: 200,
    });
  }

  @Patch('price/:truckOrderId')
  async updatePrice(
    @Param() param,
    @Body(new YupValidationPipe(updatePriceSchema)) body: TruckOrderDto,
    @Response() res,
  ): Promise<[]> {
    const { truckOrderId } = param
    const data = await this.truckOrderService.updatePriceOrder(truckOrderId, body);
    return res.status(200).json({
      message: 'Order price update successfully',
      data,
      statusCode: 200,
    });
  }

  @Delete(':truckOrderId')
  async delete(
    @Param() param,
    @Response() res,
  ): Promise<[]> {
    const { truckOrderId } = param
    await this.truckOrderService.deleteOrder(truckOrderId);
    return res.status(200).json({
      message: 'Truck Order deleted successfully',
      statusCode: 200,
    });
  }
}