import { Controller, Get, Request, Post, Body, Put, Param, Delete, UseGuards, ValidationPipe, UsePipes} from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDataDto, UpdateUserDto, UserDto, CallVerifyDto } from './dto/user.dto';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { User } from './schemas/user.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private authService: AuthService) {}

  @Get()
  getStatus(): string {
    return this.appService.getStatus();
  }

//_______________________________________________
  @Get('user/all')
  async getAll(): Promise<User[]> {
    return this.authService.getAll();
  }

  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async login(@Request() req, @Body() loginDataDto: LoginDataDto) {
    console.log("auth/login");
    console.log(loginDataDto);
    return this.authService.login(req.user);
  }

  @Post('user/phoneVerify')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async verify(@Body() callVerifyDto: CallVerifyDto) {
     console.log("phoneVerify");
     console.log(callVerifyDto);
    return this.authService.callVerify(callVerifyDto);
  }

  @Post('user')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() userDto: UserDto) {
    //  console.log("auth/signup");
    //  console.log(userDto);
    return this.authService.signup(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Request() req) {
    return this.authService.getUserPublic(req.user.userId);
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
