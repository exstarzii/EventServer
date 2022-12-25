import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { EventDocument, Event } from '../schemas/event.schema';
import { EventDto, EventDtoCreate, publicEventData, Point } from '../dto/event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async update(userId, eventId, updated) {
    try {
      const query = {
        author: new mongoose.Types.ObjectId(userId),
        _id: new mongoose.Types.ObjectId(eventId),
      };
      const event = await this.eventModel.findById(query);
      await event.updateOne(updated);
      const res = await this.eventModel.findById(query);
      return res;
    } catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async getData(eventId) {
    try {
      const event = await this.eventModel.findById(
        new mongoose.Types.ObjectId(eventId),
      );
      return event;
    } catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async getEvents(origin: Point, radius: number) {
    try {
      // const events = await this.eventModel.find()
      // .where("location").near({ center: origin.coordinates, maxDistance: radius})
      const events = await this.eventModel.find( { "location" :
        { $near :
          { $geometry :
             { type : "Point" ,
               coordinates : origin.coordinates } ,
            $maxDistance : radius
     } } })
      return events;
    } catch (err) {
      console.error(err.message)
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async delete(userId: any, eventId) {
    try {
      const query = {
        author: new mongoose.Types.ObjectId(userId),
        _id: new mongoose.Types.ObjectId(eventId),
      };
      const event = await this.eventModel.findOne(query);
      const res = event.delete();
      return res;
    } catch (err) {
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async create(userId: string, eventDtoPublic: EventDtoCreate) {
    try {
      let event: EventDto = eventDtoPublic;
      event.author = new mongoose.Types.ObjectId(userId);
      event.participants = [new mongoose.Types.ObjectId(userId)];
      const res = await this.eventModel.create(event);
      return res;
    } catch (err) {
      console.error(err.message)
      throw new BadRequestException('Error', {
        cause: new Error(),
        description: err.message,
      });
    }
  }
}
