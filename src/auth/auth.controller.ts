import { Controller, Get, Request, Post, Body, Put, Param, Delete, UseGuards, ValidationPipe, UsePipes, UseFilters} from '@nestjs/common';
import { LoginDataDto, UpdateUserDto, UserDto, CallVerifyDto, AddFriendDto } from '../dto/user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../schemas/user.schema';
import { MongoExceptionFilter } from '../http-exception.filter';

@Controller('user')
export class AuthController {
    constructor(private authService: AuthService) {}
    //_______________________________________________
  @Get('/all')
  async getAll(): Promise<User[]> {
    return this.authService.getAll();
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async login(@Request() req, @Body() loginDataDto: LoginDataDto) {
    console.log("auth/login");
    console.log(loginDataDto);
    return this.authService.login(req.user);
  }

  @Post('/phoneVerify')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async verify(@Body() callVerifyDto: CallVerifyDto) {
     console.log("phoneVerify");
     console.log(callVerifyDto);
    return this.authService.callVerify(callVerifyDto);
  }


  @Post()
  @UseFilters(MongoExceptionFilter)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() userDto: UserDto) {
    //  console.log("auth/signup");
    //  console.log(userDto);
    return this.authService.signup(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/friends')
  @UseFilters(MongoExceptionFilter)
  async addFriend(@Request() req,@Body() userDto: AddFriendDto) {
    return this.authService.addFriend(req.user.userId,userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/friends')
  async getFriends(@Request() req) {
    return this.authService.getFriends(req.user.userId);
  }

  @UseGuards(JwtAuthGuard) 
  @Delete('/friends/:id')
  async delFriend(@Request() req,@Param() params: any) {
    return this.authService.delFriend(req.user.userId,params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Request() req) {
    return this.authService.getUserPublic(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUserById(@Param() params: any) {
    return this.authService.getUserPublic(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    // console.log(updateUserDto);
    return this.authService.updateUser(req.user.userId,updateUserDto);
  }

  @UseGuards(JwtAuthGuard) 
  @Delete()
  async remove(@Request() req) {
    return this.authService.deleteUser(req.user.userId);
  }
}