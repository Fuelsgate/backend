import { OfferDto, OfferQueryDto } from "../dto/offer.dto";
import { IJwtPayload } from "src/shared/strategies/jwt.strategy";
import { OfferRepository } from "../repositories/offer.repository";
import { UserRepository } from "src/modules/user/repositories/user.repository";
import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ProductUploadRepository } from "src/modules/product-upload/repositories/product-upload.repository";
import { MessageGateway } from "../gateway/message.gateway";

@Injectable()
export class OfferService {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly userRepository: UserRepository,
    private readonly productUploadRepository: ProductUploadRepository,
    @Inject(forwardRef(() => MessageGateway))
    private readonly messageGateway: MessageGateway
  ) { }

  async saveNewOfferData(offerData: OfferDto, user: IJwtPayload) {
    if (user.role !== 'buyer') throw new ForbiddenException("You are not authorized to make this request")
    const receiver = await this.userRepository.findOne(offerData.receiverId);
    const buyer = await this.userRepository.findOne(user.id);
    const productUpload = await this.productUploadRepository.findOne(offerData.productUploadId);

    if (!productUpload) throw new BadRequestException("Product Upload ID is invalid");
    if (!receiver) throw new BadRequestException("Receiver ID is invalid");
    if (!buyer) throw new BadRequestException("Buyer ID is invalid");

    offerData.senderId = buyer._id;
    offerData.receiverId = receiver._id;
    offerData.productUploadId = productUpload._id;

    const offer = await this.offerRepository.create(offerData);
    this.messageGateway.broadcastOffer(offer, user);
    return offer
  }

  async getAllOffers(query: OfferQueryDto) {
    const { page = 1, limit = 10, search, status, profileId, productUploadId } = query;
    const offset = (page - 1) * limit;

    const searchFilter: any = {
      $or: [],
      $and: [],
    };

    const user = await this.userRepository.findOne(profileId);

    if (status) searchFilter.$and.push({ status: { $regex: status, $options: 'i' } });
    if (productUploadId) searchFilter.$and.push({ productUploadId: { $regex: productUploadId, $options: 'i' } });
    if (profileId) searchFilter.$or.push(
      { senderId: user?._id },
      { receiverId: user?._id }
    );

    if (search) {
      searchFilter.$or.push(
        { 'senderDetails.firstName': search },
        { 'senderDetails.lastName': search },
        { 'receiverDetails.firstName': search },
        { 'receiverDetails.lastName': search }
      )
    }

    if (!searchFilter.$or.length) delete searchFilter.$or;
    if (!searchFilter.$and.length) delete searchFilter.$and;

    const offers = await this.offerRepository.findAll(searchFilter, offset, limit);
    const total = await this.offerRepository.getTotal(searchFilter);
    return {
      offers,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOfferDetail(offerId: string) {
    const offer = await this.offerRepository.findOne(offerId)

    if (!offer) {
      throw new NotFoundException({
        message: 'Offer not found',
        statusCode: 404
      });
    }

    return offer
  }

  async updateOfferData(offerId: string, offerData: OfferDto) {
    console.log('offerData', offerData)
    return await this.offerRepository.update(offerId, offerData);
  }

  async deleteOfferData(offerId: string) {
    const offer = await this.offerRepository.delete(offerId);
    if (!offer) {
      throw new NotFoundException({
        message: 'Offer not found',
        statusCode: 404
      });
    }
    return true
  }
}