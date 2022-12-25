import { Controller, Get, Request, Post, Body, Put, Param, Delete, UseGuards, ValidationPipe, UsePipes} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventService } from './event.service';
import { EventDto, Point } from '../dto/event.dto';
import { identity } from 'rxjs';

@Controller('event')
export class EventController {
    constructor(private eventService: EventService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async create(@Request() req,@Body() eventDto: EventDto) {
      return this.eventService.create(req.user.userId,eventDto);
    }
  
    @Get('/id')
    async getEvent(@Param('id') id: string) {
      return this.eventService.getData(id);
    }

    @Get()
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async getAllEvent(@Param('origin') origin:Point,@Param('radius') radius:number) {
      return this.eventService.getEvents(origin, radius);
    }
  
    @UseGuards(JwtAuthGuard)
    @Put('/id')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async update(@Request() req, @Param('id') id: string, @Body() eventDto: EventDto) {
      return this.eventService.update(req.user.userId, id,eventDto);
    }
  
    @UseGuards(JwtAuthGuard) 
    @Delete('/id')
    async remove(@Request() req,@Param('id') id: string) {
      return this.eventService.delete(req.user.userId,id);
    }
}
