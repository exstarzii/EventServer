import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { EventSchema } from '../schemas/event.schema';
import { EventController } from './event.controller';

describe('EventController', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: Event.name, schema: EventSchema },
        ]),
      ],
      controllers: [EventController],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
