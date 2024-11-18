import { MessageGateway } from "../gateway/message.gateway";
import { MessageDto, MessageQueryDto } from "../dto/message.dto";
import { IJwtPayload } from "src/shared/strategies/jwt.strategy";
import { OfferRepository } from "../repositories/offer.repository";
import { MessageRepository } from "../repositories/message.repository";
import { UserRepository } from "src/modules/user/repositories/user.repository";
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
    private readonly offerRepository: OfferRepository,
    @Inject(forwardRef(() => MessageGateway))
    private readonly messageGateway: MessageGateway
  ) { }

  async sendMessage(messageBody: MessageDto, user: IJwtPayload) {
    const sender = await this.userRepository.findOne(user.id);
    const offer = await this.offerRepository.findOne(messageBody.offerId);

    if (!sender) throw new BadRequestException("Sender ID is invalid");
    if (!offer) throw new BadRequestException("Offer ID is invalid");

    messageBody.userId = sender._id;
    messageBody.offerId = offer._id;

    const message = await this.messageRepository.create(messageBody);
    this.messageGateway.broadcastMessage(message, user);
    return message
  }

  async getAllMessages(query: MessageQueryDto, offerId: string) {
    const { page = 1, limit = 10, search } = query;
    const offset = (page - 1) * limit;
    const offer = await this.offerRepository.findOne(offerId);
    if (!offer) throw new BadRequestException("Offer ID is invalid");

    const searchFilter: any = {
      $and: [
        { offerId: offer._id },
      ],
      $or: [],
    };

    if (search) searchFilter.$or.push({ offer: search });
    if (!searchFilter.$or.length) delete searchFilter.$or;

    const messages = await this.messageRepository.findAll(searchFilter, offset, limit);
    const total = await this.messageRepository.getTotal(searchFilter);

    return {
      offer,
      messages,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMessageDetail(messageId: string) {
    const message = await this.messageRepository.findOne(messageId)

    if (!message) {
      throw new NotFoundException({
        message: 'Message not found',
        statusCode: 404
      });
    }

    return message
  }

  async updateMessageDetail(messageId: string, messageBody: MessageDto, user: IJwtPayload) {
    const sender = await this.userRepository.findOne(user.id);
    messageBody.actionBy = sender._id
    const message = await this.messageRepository.update(messageId, messageBody);
    this.messageGateway.broadcastMessage(message, user);
    return message
  }

  async delete(messageId: string) {
    const message = await this.messageRepository.delete(messageId);
    if (!message) {
      throw new NotFoundException({
        message: 'Message not found',
        statusCode: 404
      });
    }
    return true;
  }
}