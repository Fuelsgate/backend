import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { RoleSeedModule } from './modules/role/role.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import {
  DATABASE_CONNECTION_URL,
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_USERNAME,
} from './constants';
import { MailerModule } from '@nestjs-modules/mailer';
import { BuyerModule } from './modules/buyer/buyer.module';
import { TransporterModule } from './modules/transporter/transporter.module';
import { SellerModule } from './modules/seller/seller.module';
import { ProductModule } from './modules/product/product.module';
import { DepotHubModule } from './modules/depot-hub/depot-hub.module';
import { ProductUploadModule } from './modules/product-upload/product-upload.module';
import { TruckModule } from './modules/truck/truck.module';
import { OrderModule } from './modules/order/order.module';
import { TruckOrderModule } from './modules/truck-order/truck-order.module';
import { OfferModule } from './modules/offer/offer.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(DATABASE_CONNECTION_URL),
    MailerModule.forRoot({
      transport: {
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: false,
        auth: {
          user: EMAIL_USERNAME,
          pass: EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: 'FuelsGate <noreply@fuelsgate.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
    AuthenticationModule,
    UserModule,
    RoleSeedModule,
    BuyerModule,
    TransporterModule,
    SellerModule,
    ProductModule,
    DepotHubModule,
    ProductUploadModule,
    TruckModule,
    OrderModule,
    TruckOrderModule,
    OfferModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }