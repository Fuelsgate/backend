import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from '../entities/role.entities';
import { RoleDto, RoleType } from '../dto/role.dto';

@Injectable()
export class RoleRepository {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  async findAll() {
    return await this.roleModel.find();
  }

  async findOne(id: Types.ObjectId): Promise<RoleDto | undefined> {
    return this.roleModel.findById(id);
  }

  async findRoleByName(name: RoleType): Promise<RoleDto | undefined> {
    return this.roleModel.findOne({ name }).exec() as unknown as Promise<
      RoleDto | undefined
    >;
  }
}
