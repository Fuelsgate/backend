import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductDto } from '../dto/product.dto';

@Injectable()
export class ProductSeedService {
  private readonly logger = new Logger(ProductSeedService.name);

  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

  private readonly PRODUCTS: ProductDto[] = [
    { name: 'PMS (Premium Motor Spirits)', value: 'pms', color: 'bg-sky-300', status: 'active', unit: 'Ltr' },
    { name: 'AGO (Automotive Gas Oil)', value: 'ago', color: 'bg-blue-600', status: 'active', unit: 'Ltr' },
    { name: 'DPK (Dual Purpose Kerosene)', value: 'dpk', color: 'bg-yellow', status: 'active', unit: 'Ltr' },
    { name: 'ATK (Aviation Turbine Kerosene)', value: 'atk', color: 'bg-gray-500', status: 'active', unit: 'Ltr' },
    { name: 'LPG (Liquefied Petroleum Gas)', value: 'lpg', color: 'bg-red-tone-400', status: 'active', unit: 'MT' },
    { name: 'CNG (Compressed Natural Gas)', value: 'cng', color: 'bg-green-600', status: 'active', unit: 'MT' }
  ];

  async seedProductData() {
    const existingProducts = await this.productModel.find({});

    if (existingProducts.length < 5) {
      await this.productModel.deleteMany({});
      await this.productModel.insertMany(this.PRODUCTS);
      this.logger.log('Products seeded successfully');
    } else {
      this.logger.log('Products already exist. Seeding skipped.');
    }
  }
}
