import { Module } from '@nestjs/common';
import { TruckOrderService } from './services/truck-order.service';
import { OrderController } from './controllers/truck-order.controller';
import { TruckOrderRepository } from './repositories/truck-order.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { TruckOrder, TruckOrderSchema } from './entities/truck-order.entity';
import { BuyerRepository } from '../buyer/repositories/buyer.repository';
import { Buyer, BuyerSchema } from '../buyer/entities/buyer.entity';
import { Transporter, TransporterSchema } from '../transporter/entities/transporter.entity';
import { TransporterRepository } from '../transporter/repositories/transporter.repository';
import { TruckRepository } from '../truck/repositories/truck.repository';
import { Truck, TruckSchema } from '../truck/entities/truck.entity';
import { OrderRepository } from '../order/repositories/order.repository';
import { Order, OrderSchema } from '../order/entities/order.entity';
import { Seller, SellerSchema } from '../seller/entities/seller.entity';
import { SellerRepository } from '../seller/repositories/seller.repository';
import { TruckOrderGateway } from './gateway/truck-order.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TruckOrder.name, schema: TruckOrderSchema },
      { name: Truck.name, schema: TruckSchema },
      { name: Transporter.name, schema: TransporterSchema },
      { name: Buyer.name, schema: BuyerSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Seller.name, schema: SellerSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [TruckOrderService, TruckOrderRepository, TruckRepository, TransporterRepository, OrderRepository, BuyerRepository, SellerRepository, TruckOrderGateway],
  exports: [],
})
export class TruckOrderModule { }