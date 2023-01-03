import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';
import { Message, MessageSchema } from './schemas/message.schema';
import { Room, RoomSchema } from './schemas/room.schema';

describe('MessagesGateway', () => {
  let gateway: RoomGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        MongooseModule.forFeature([
          { name: Room.name, schema: RoomSchema },
          { name: Message.name, schema: MessageSchema },
        ]),
      ],
      providers: [RoomGateway, RoomService],
    }).compile();

    gateway = module.get<RoomGateway>(RoomGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

});
