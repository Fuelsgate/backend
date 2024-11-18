import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IJwtPayload } from "src/shared/strategies/jwt.strategy";
import { BuyerRepository } from "src/modules/buyer/repositories/buyer.repository";
import { generateOrderId } from "src/utils/helpers";
import { TruckOrderRepository } from "../repositories/truck-order.repository";
import { TruckOrderDto, TruckOrderQueryDto } from "../dto/truck-order.dto";
import { TruckRepository } from "src/modules/truck/repositories/truck.repository";
import { OrderRepository } from "src/modules/order/repositories/order.repository";
import { SellerRepository } from "src/modules/seller/repositories/seller.repository";
import { TruckOrderGateway } from "../gateway/truck-order.gateway";
import { TransporterRepository } from "src/modules/transporter/repositories/transporter.repository";

@Injectable()
export class TruckOrderService {
  constructor(
    private truckOrderRepository: TruckOrderRepository,
    private truckRepository: TruckRepository,
    private buyerRepository: BuyerRepository,
    private sellerRepository: SellerRepository,
    private transporterRepository: TransporterRepository,
    private orderRepository: OrderRepository,
    @Inject(forwardRef(() => TruckOrderGateway))
    private readonly truckOrderGateway: TruckOrderGateway
  ) { }
  async getAllOrders(query: TruckOrderQueryDto) {
    const { page, limit, status, trackingId, buyerId, truckId, profileId, profileType, orderId } = query;
    let offset = 0;
    if (page && page > 0) {
      offset = (page - 1) * limit;
    }

    if (profileId && !profileType) {
      throw new BadRequestException("Please provide a profile type")
    }

    let profile: any, buyer: any, order: any;

    if (buyerId) buyer = await this.buyerRepository.findOneQuery(buyerId)
    if (profileId && profileType === 'seller') profile = await this.sellerRepository.findOne(profileId)
    if (profileId && profileType === 'transporter') profile = await this.transporterRepository.findOne(profileId)
    if (orderId) order = await this.orderRepository.findOne(orderId)

    if (buyerId && !buyer) throw new BadRequestException("Buyer ID is invalid")
    if (profileId && !profile) throw new BadRequestException("Profile ID is invalid")
    if (orderId && !order) throw new BadRequestException("order ID is invalid")

    const searchFilter: any = {
      $or: []
    };

    if (buyerId) searchFilter.$or.push({ buyerId: buyer?._id });
    if (orderId) searchFilter.$or.push({ orderId: order?._id });
    if (profileId) searchFilter.$or.push({ profileId: profile?._id });
    if (trackingId) searchFilter.$or.push({ trackingId: { $regex: trackingId, $options: 'i' } });
    if (status) searchFilter.$or.push({ status: { $regex: status, $options: 'i' } });
    if (truckId) searchFilter.$or.push({ truckId: { $regex: truckId, $options: 'i' } });

    if (!searchFilter.$or.length) delete searchFilter.$or;

    const truckOrders = await this.truckOrderRepository.findAll(searchFilter, offset, limit);
    const total = await this.truckOrderRepository.getTotal(searchFilter);

    return {
      truckOrders,
      total,
      currentPage: page && page > 0 ? Number(page) : 1,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOneOrder(truckOrderId: string) {
    const truckOrder = await this.truckOrderRepository.findOne(truckOrderId)
    if (!truckOrder) {
      throw new NotFoundException('Truck order Not found')
    }
    return truckOrder
  }

  async updateStatusOrder(truckOrderId: string, body: TruckOrderDto) {
    const order = await this.truckOrderRepository.update(truckOrderId, body);
    this.truckOrderGateway.broadcastOrderStatus(order);
    return order
  }

  async updatePriceOrder(truckOrderId: string, body: TruckOrderDto) {
    const order = await this.truckOrderRepository.update(truckOrderId, body);
    this.truckOrderGateway.broadcastOrderPrice(order);
    return order
  }

  async createNewOrder(payload: TruckOrderDto, user: IJwtPayload) {
    if (user.role !== 'buyer') throw new ForbiddenException("You are not authorized to make this request")
    const truck = await this.truckRepository.findOne(payload.truckId)
    const buyer = await this.buyerRepository.findOneQuery({ userId: user.id })

    if (payload.orderId) {
      const order = await this.orderRepository.findOne(payload?.orderId)
      if (!order) throw new BadRequestException("Order ID is invalid")
      payload.orderId = order._id;
    }

    if (!buyer) throw new BadRequestException("Buyer ID is invalid")
    if (!truck) throw new BadRequestException("Truck ID is invalid")

    payload.buyerId = buyer._id;
    payload.truckId = truck._id;
    payload.profileId = truck.profileId;
    payload.profileType = truck.profileType;
    payload.trackingId = generateOrderId('FG-TORD')

    const order = await this.truckOrderRepository.create(payload)
    this.truckOrderGateway.broadcastOrder(order, user);
    return order;
  }

  async deleteOrder(truckOrderId: string) {
    const truckOrder = await this.truckOrderRepository.delete(truckOrderId)
    if (!truckOrder) {
      throw new NotFoundException('Truck Order Not found')
    }
    return truckOrder
  }
}