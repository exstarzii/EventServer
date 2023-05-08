import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { AddFriendDto, CallVerifyDto, publicUserData, UserDto } from '../dto/user.dto';
import { SmsService } from './sms.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private smsService: SmsService,
  ) {}

  async validateUser(nickname: string, code: string): Promise<any> {
    //console.log("validateUser");
    const query = {'nickname':nickname}
    const user = await this.userModel.findOne(query);
    if(!user)return;
    if(user.failedLoginAttempt >= +process.env.MaximumNumberOfLoginAttempts){
      console.log('too many attems to log in!');
      throw new BadRequestException('Duplicate nickname', {
        cause: new Error(),
        description: 'too many attems to log in! try call or message verify again',
      });
    }
    // console.log(user);
    if (user.code == code) {
      console.log("validateUser pass");
      return {userId :user._id};
    }else {
      console.log("failedLoginAttempt "+user.code+" | "+code);
      user.failedLoginAttempt++;
      user.save();
      return;
    }
  }
  
  async login(user: any) {
    const payload = { sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async updateUser(userId: any, updatedUser: any) {
    console.log(updatedUser);
    const user = await this.userModel.findById(userId);
    try{
      await user.updateOne(updatedUser);
      return user;
    }
    catch(err){
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async getUser(userId: any) {
    const user = await this.userModel.findById(userId);
    //console.log(user);
    if(!user)return;
    return user;
  }

  async getUserPublic(userId: any) {
    const user = await this.userModel.findById(userId, publicUserData);
    // console.log(user);
    if(!user)return;
    return user;
  }

  // ____________________________________________
  async getAll(): Promise<any | undefined> {
    const users = await this.userModel.find();
    return users;
  }

  async deleteUser(userId: any) {
    const user = await this.userModel.findById(userId);
    try{
      const res = user.delete();
      return res;
    }
    catch(err){
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async callVerify(callVerifyDto: CallVerifyDto) {
    const query = {'nickname':callVerifyDto.nickname}
    const user = await this.userModel.findOne(query);
    if(!user){
      throw new BadRequestException('Wrong nickname', {
        cause: new Error(),
        description: 'There is no such nickname',
      });
    }
    if(process.env.UseCallVerification == 'true'){
      const res = await this.smsService.call(user.phone);
      if(res.status == "OK"){
        user.failedLoginAttempt=0;
        user.code = res.code;
        user.save();
      }
      else throw new BadRequestException('Wrong phone', {
        cause: new Error(),
        description: 'Wrong phone',
      });
    }else{
      user.code = "4321";
      user.failedLoginAttempt=0;
      user.save();
      return user.code;
    }
    
  }

  async signup(usertDto: UserDto): Promise<User> {
    // try{
      usertDto.failedLoginAttempt=0;
      const user = await this.userModel.create(usertDto);
      let callVerifyDto =new CallVerifyDto();
      callVerifyDto.nickname = usertDto.nickname
      this.callVerify(callVerifyDto)
      return user;
    // }
    // catch(err){
    //   console.log(err);
    //   throw new BadRequestException([err.message], {
    //     cause: new Error(),
    //     description: 'Error',
    //   });
    // }
  }
  async addFriend(userId: any,userDto: AddFriendDto) {
    try{
      const user = await this.userModel.findById(userId);
      const friend = await this.userModel.findById(userDto._id);
    
      user.friends?user.friends.push(userDto._id):[userDto._id]
      friend.friends?friend.friends.push(userId):[userId]

      await user.save()
      await friend.save()
      return friend;
    }
    catch(err){
      console.error(err)
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }
  async getFriends(userId: any) {
    const user = await this.userModel.findById(userId);
    // user.friends.map(el=>new mongoose.Types.ObjectId(el))
    const users = await this.userModel.find({ _id: { $in: user.friends } });
    return users;
  }
  async delFriend(userId: any, friendId: any) {
    try {
      const user = await this.userModel.findById(userId);
      const friend = await this.userModel.findById(friendId);
      if (user.friends) {
        const indexToDelete = user.friends.indexOf(friendId);
        if (indexToDelete !== -1) {
          user.friends.splice(indexToDelete, 1);
        }
        user.save()
      }
      if (friend.friends) {
        const indexToDelete = friend.friends.indexOf(userId);
        if (indexToDelete !== -1) {
          friend.friends.splice(indexToDelete, 1);
        }
        friend.save()
      }
      return friend;
    }
    catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }
}