import { ForbiddenException, Injectable } from '@nestjs/common';
import { BuyerDto } from '../dto/buyer.dto';
import { BuyerRepository } from '../repositories/buyer.repository';
import { IJwtPayload } from 'src/shared/strategies/jwt.strategy';
import { ProductUploadRepository } from 'src/modules/product-upload/repositories/product-upload.repository';
import { TruckRepository } from 'src/modules/truck/repositories/truck.repository';

@Injectable()
export class BuyerService {
  constructor(
    private buyerRepository: BuyerRepository,
    private productUploadRepository: ProductUploadRepository,
    private truckRepository: TruckRepository,
  ) { }

  async saveNewBuyerInfo(buyerData: BuyerDto, user: IJwtPayload) {
    if (user.role !== 'buyer') {
      throw new ForbiddenException(
        'You are not authorized to create a buyer account',
      );
    }

    return await this.buyerRepository.create({
      ...buyerData,
      userId: user.id,
    });
  }

  async getAnalytics(user: IJwtPayload) {
    if (user.role !== 'buyer') {
      throw new ForbiddenException('Unauthorized Access');
    }

    const totalVolume =
      await this.productUploadRepository.getTotalVolumeForToday();
    const totalTrucks =
      await this.truckRepository.totalProfilesWithAvailableTrucks();
    const totalSellers =
      await this.productUploadRepository.totalSellersWithUploadsToday();

    return {
      totalVolume,
      totalTrucks,
      totalSellers,
    };
  }
}
