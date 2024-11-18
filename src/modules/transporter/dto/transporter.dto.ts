import { Types } from 'mongoose';

export interface TransporterDto {
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  phoneNumber: string;
  state: string;
  userId: Types.ObjectId | string | undefined;
}
