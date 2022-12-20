import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Designer, DesignerDocument } from '../schemas/designer.schema';
import { SysRequest, SysRequestDocument } from '../schemas/sysrequest.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { SysRequestDto } from '../dto/sys-request.dto';
import { CallVerifyDto, UserDto } from '../dto/user.dto';
import { SmsService } from './sms.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Designer.name) private designerModel: Model<DesignerDocument>,
    @InjectModel(SysRequest.name) private sysRequestModel: Model<SysRequestDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private smsService: SmsService,
  ) {}

  async validateUser(nickname: string, code: string): Promise<any> {
    // console.log("validateUser");
    const user = await this.userModel.findById(nickname);

    if(user.failedLoginAttempt >= +process.env.MONGODB_URI){
      console.log('too many attems to log in!');
      throw new BadRequestException('Duplicate nickname', {
        cause: new Error(),
        description: 'too many attems to log in! try call or message verify again',
      });
    }

    // console.log(user);
    if (user && user.code === code) {
      // console.log("validateUser pass");
      const { code, ...result } = user;
      return result;
    }else {
      user.failedLoginAttempt++;
    }
    return null;
  }
  
  async login(user: any) {
    const payload = { sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // async updateUser(userId: any, updatedUser: any) {
  //   await this.usersService.updateUser(userId,updatedUser);
  // }

  async getUser(userId: any) {
    const user = await this.userModel.find(userId);
    if(!user)return;
    // console.log(user);
    return user;
  }

  // async getAll(): Promise<any | undefined> {
  //   const users = await this.usersService.getAll();
  //   return users;
  // }

  // async deleteUser(userId: any) {
  //   await this.usersService.deleteUser(userId);
  // }

  async callVerify(callVerifyDto: CallVerifyDto) {
    const user = await this.userModel.findOne(callVerifyDto);
    if(!user){
      throw new BadRequestException('Wrong nickname', {
        cause: new Error(),
        description: 'There is no such nickname',
      });
    }
    const res = await this.smsService.call(user.phone);
    if(res.status == "OK"){
      user.code = res.code;
      this.userModel.findByIdAndUpdate(user.nickname,user);
    }
    else throw new BadRequestException('Wrong phone', {
      cause: new Error(),
      description: 'Wrong phone',
    });
  }

  async signup(usertDto: UserDto): Promise<User> {
    const check = await this.userModel.find(usertDto).count();
    if (check > 0)
      throw new BadRequestException('Duplicate nickname', {
        cause: new Error(),
        description: 'The database already has such a nickname',
      });
    const user = await this.userModel.create(usertDto);
    return user;
  }
}