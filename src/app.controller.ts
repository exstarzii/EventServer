import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { SysRequestDto } from './dto/sys-request.dto';
import { Designer } from './schemas/designer.schema';
import { SysRequest } from './schemas/sysrequest.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus(): string {
    return this.appService.getStatus();
  }

  @Get('/requests')
  async getRequests(): Promise<SysRequest[]> {
    return this.appService.getRequests();
  }

  @Post('/requests')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async makeRequest(@Body() sysRequestDto: SysRequestDto): Promise<SysRequest> {
    return this.appService.makeRequest(sysRequestDto);
  }

  @Get('/designers')
  async getDesigners(): Promise<Designer[]> {
    return this.appService.getDesigners();
  }
}
