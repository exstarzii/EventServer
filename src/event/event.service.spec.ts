import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { EventSchema, Event } from '../schemas/event.schema';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let authorId = '63a4488fa747bcfb95fc43c3';
  let eventId;
  let zvl =  {
    type: 'Point',
    coordinates: [56.640441, 43.387161],
  };
  let gorodets =  {
    type: 'Point',
    coordinates: [56.644821, 43.472354],
  };
  let balahna =  {
    type: 'Point',
    coordinates: [56.504917, 43.601293],
  };
  let createDto = {
    name: 'name',
    dateStart: Date.now().toString(),
    dateEnd:  Date.now().toString(),
    category: '',
    location: gorodets,
    images: '',
    description: '',
  };
  let updatedEvent = {
    name: 'name2',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        // MongooseModule.forRootAsync({
        //   useFactory: async () => ({
        //     uri: process.env.MONGODB_URI,
        //     useNewUrlParser: true,
        //     useCreateIndex: true,
        //   }),
        //  }),
        MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
      ],
      providers: [EventService],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return new event', async () => {
    console.log(createDto);
      const res = await service.create(authorId, createDto);
      eventId = res._id;
      expect(res).toHaveProperty('_id');
  });

  it('should get gorodets event near 10 km from zvl', async () => {
    const res = await service.getEvents(zvl,10000);
    expect(res.length).toBeGreaterThan(0);
  });

  it('should not get gorodets event near 10 km from balahna', async () => {
    const res = await service.getEvents(balahna,10000);
    expect(res.length).toBe(0);
  });

  it('should update event', async () => {
    const res = await service.update(authorId, eventId, updatedEvent);
    expect(res).toHaveProperty('name', 'name2');
  });

  it('should get event', async () => {
    const res = await service.getData(eventId);
    expect(res).toHaveProperty('name', 'name2');
  });

  it('should show error on get event', async () => {
    try {
      const res = await service.getData('non exist');
      expect(res).toHaveProperty('name', 'name2');
    } catch (e) {
      console.error(e.massage);
    }
  });

  it('should delete event', async () => {
    const res = await service.delete(authorId, eventId);
    expect(res).toHaveProperty('_id');
  });

  it('should show error on delete', async () => {
    try {
      const res = await service.delete(authorId, '63a4488fa747bcfb95fc43c3');
      expect(res).toHaveProperty('_id');
    } catch (e) {
      console.error(e.massage);
    }
  });
});
