import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Designer, DesignerDocument } from '../schemas/designer.schema';
import { SysRequest, SysRequestDocument } from '../schemas/sysrequest.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { SysRequestDto } from '../dto/sys-request.dto';
import { UserDto } from '../dto/user.dto';
import { SmsService } from './sms.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Designer.name) private designerModel: Model<DesignerDocument>,
    @InjectModel(SysRequest.name) private sysRequestModel: Model<SysRequestDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private smsService: SmsService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // console.log("validateUser");
    const user = await this.usersService.findOne(email);
    // console.log(user);
    if (user && user.password === pass) {
      // console.log("validateUser pass");
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async login(user: any) {
    const payload = { sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async updateUser(userId: any, updatedUser: any) {
    await this.usersService.updateUser(userId,updatedUser);
  }

  async getUser(userId: any) {
    const user = await this.usersService.findById(userId);
    if(!user)return;
    // console.log(user);
    return user;
  }

  async getAll(): Promise<any | undefined> {
    const users = await this.usersService.getAll();
    return users;
  }

  async deleteUser(userId: any) {
    await this.usersService.deleteUser(userId);
  }

  async signup(usertDto: UserDto): Promise<User> {
    const check = await this.userModel.find(usertDto).count();
    if (check > 0)
      throw new BadRequestException('Duplicate nickname', {
        cause: new Error(),
        description: 'The database already has such a nickname',
      });
    const user = await this.userModel.create(usertDto);
    //this.smsService.call(user.phone);
    return user;
  }
}