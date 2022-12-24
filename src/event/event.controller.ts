import { Controller, Get, Request, Post, Body, Put, Param, Delete, UseGuards, ValidationPipe, UsePipes} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventService } from './event.service';
import { EventDto } from '../dto/event.dto';

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
    async getUser(@Param('id') id: string) {
      return this.eventService.getData(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Put('/id')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async update(@Request() req, @Param('id') id: string, @Body() eventDto: EventDto) {
      return this.eventService.update(req.user.userId, id,eventDto);
    }
  
    @UseGuards(JwtAuthGuard) 
    @Delete('/id')
    async remove(@Param('id') id: string) {
      return this.eventService.delete(id);
    }
}
