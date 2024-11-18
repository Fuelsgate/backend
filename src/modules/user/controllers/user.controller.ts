import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Response,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IUser, IUserWithRole, UpdatePasswordDto } from '../dto/user.dto';
import { YupValidationPipe } from 'src/shared/pipes/yup-validation.pipe';
import { updatePasswordSchema } from '../validations/user.validation';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: IUserWithRole): Promise<IUserWithRole> {
    return this.userService.createNew(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('change-password')
  async updatePassword(
    @Request() req,
    @Body(new YupValidationPipe(updatePasswordSchema)) body: UpdatePasswordDto,
    @Response() res,
  ) {
    const { user } = req
    const data = await this.userService.updatePassword(user, body);
    return res.status(200).json({
      message: 'Password changed successfully',
      data,
      statusCode: 200,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: IUser) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
