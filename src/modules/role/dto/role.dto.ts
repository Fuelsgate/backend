import { Types } from 'mongoose';

export type RoleType = 'buyer' | 'seller' | 'transporter';

export class RoleDto extends Document {
  name: RoleType;
  _id?: Types.ObjectId;
}
