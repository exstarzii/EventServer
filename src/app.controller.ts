import { Controller, Get, Request, Post, Body, Put, Param, Delete, UseGuards, ValidationPipe, UsePipes} from '@nestjs/common';
import { AppService } from './app.service';
import { SysRequestDto } from './dto/sys-request.dto';
import { Designer } from './schemas/designer.schema';
import { SysRequest } from './schemas/sysrequest.schema';
import { LoginDataDto, CreateUserDto, UpdateUserDto, UserDto } from './dto/user.dto';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private authService: AuthService) {}

  @Get()
  getStatus(): string {
    return this.appService.getStatus();
  }

  // @Get('/requests')
  // async getRequests(): Promise<SysRequest[]> {
  //   return this.appService.getRequests();
  // }

  // @Post('/requests')
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // async makeRequest(@Body() sysRequestDto: SysRequestDto): Promise<SysRequest> {
  //   return this.appService.makeRequest(sysRequestDto);
  // }

  // @Get('/designers')
  // async getDesigners(): Promise<Designer[]> {
  //   return this.appService.getDesigners();
  // }

  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async login(@Request() req, @Body() loginDataDto: LoginDataDto) {
    console.log("auth/login");
    console.log(loginDataDto);
    return this.authService.login(req.user);
  }

  @Post('user')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() userDto: UserDto) {
     console.log("auth/signup");
     console.log(userDto);
    return this.authService.signup(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('user')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(req.user.userId,updateUserDto);
  }

  @UseGuards(JwtAuthGuard) 
  @Delete('user')
  async remove(@Request() req) {
    return this.authService.deleteUser(req.user.userId);
  }
}
