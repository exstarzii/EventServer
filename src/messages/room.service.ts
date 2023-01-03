import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { Room, RoomDocument } from './schemas/room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userId, createRoomDto: CreateRoomDto) {
    try {
      if (createRoomDto.members.indexOf(userId) == -1) {
        createRoomDto.members.push(userId);
      }
      const room = await this.roomModel.create(createRoomDto);
      return room;
    } catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async findAll(userId: string) {
    try {
      const query = { members: { $elemMatch: { userId } } };
      const rooms = await this.roomModel.find(query);
      let arr = Array();
      rooms.forEach((room) => {
        arr.push(this.findOne(userId, String(room._id)));
      });
      return arr;
    } catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const query = { members: { $elemMatch: { userId }, _id: id } };
      const room = await this.roomModel.findOne(query);
      const members = await this.userModel.find({ id: { $in: room.members } });
      let res: any = room;
      res.members = members;
      console.log(res);
      if (!res) return;
      return res;
    } catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async update(userId, updateRoomDto: UpdateRoomDto) {
    const query = {
      members: { $elemMatch: { userId }, _id: updateRoomDto._id },
    };
    const room = await this.roomModel.findOne(query);
    try {
      await room.updateOne(updateRoomDto);
    } catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async remove(userId, id: string) {
    try {
      const query = { members: { $elemMatch: { userId }, _id: id } };
      const room = await this.roomModel.findOne(query);
      const res = room.delete();
      return res;
    } catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }
}
