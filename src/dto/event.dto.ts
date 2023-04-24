import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Max,
  Min,
} from 'class-validator';
import mongoose, { Date } from 'mongoose';

export let publicEventData = `
  _id
  name
  dateStart
  dateEnd
  category
  location
  images
  participants
  author
  description
  `;

export class EventDtoExtra {
  @IsOptional()
  name: string;
  @IsOptional()
  dateStart: string;
  @IsOptional()
  dateEnd: string;
  @IsOptional()
  category: string;
  @IsOptional()
  images: string;
  @IsOptional()
  description: string;
}
export class EventDto extends EventDtoExtra {
  @IsOptional()
  author?: mongoose.Types.ObjectId;
  @IsOptional()
  participants?: [mongoose.Types.ObjectId];
  @IsOptional()
  _id?: string;
  @IsOptional()
  location: {
    type: String;
    coordinates: Number[];
  };
}

export class EventDtoCreate extends EventDtoExtra {
  @IsOptional()
  author?: mongoose.Types.ObjectId;
  @IsOptional()
  participants?: [mongoose.Types.ObjectId];
  @IsOptional()
  _id?: string;
  @IsOptional()
  location: {
    type: String;
    coordinates: Number[];
  };
}

export class Point {
  type: String;
  coordinates: Number[];
}
