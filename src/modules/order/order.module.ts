import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { OrderRepository } from './repositories/order.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { SellerRepository } from '../seller/repositories/seller.repository';
import { ProductUploadRepository } from '../product-upload/repositories/product-upload.repository';
import { Seller, SellerSchema } from '../seller/entities/seller.entity';
import { ProductUpload, ProductUploadSchema } from '../product-upload/entities/product-upload.entity';
import { BuyerRepository } from '../buyer/repositories/buyer.repository';
import { Buyer, BuyerSchema } from '../buyer/entities/buyer.entity';
import { Offer, OfferSchema } from '../offer/entities/offer.entity';
import { OrderGateway } from './gateway/order.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Seller.name, schema: SellerSchema },
      { name: ProductUpload.name, schema: ProductUploadSchema },
      { name: Buyer.name, schema: BuyerSchema },
      { name: Offer.name, schema: OfferSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, SellerRepository, ProductUploadRepository, BuyerRepository, OrderGateway],
  exports: [],
})
export class OrderModule { }