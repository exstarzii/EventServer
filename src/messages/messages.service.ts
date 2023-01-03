import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto, UpdateMessageDto} from './dto/message.dto';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessagesService {

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    try{
      const message = await this.messageModel.create(createMessageDto);
      return message;
    }
    catch(err){
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async findAll(roomId: string) {
    const query = {'roomId':roomId}
    const messages = await this.messageModel.find(query);
    console.log(messages);
    if(!messages)return;
    return messages;
  }

  async findOne(id: string) {
    const message = await this.messageModel.findById(id);
    console.log(message);
    if(!message)return;
    return message;
  }

  async update(updateMessageDto: UpdateMessageDto) {
    const message = await this.messageModel.findById(updateMessageDto._id);
    try{
      await message.updateOne(updateMessageDto);
    }
    catch(err){
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const message = await this.messageModel.findById(id);
      const res = message.delete();
      return res;
    } catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  } 
}
