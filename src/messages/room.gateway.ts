import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { UseGuards, Request} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@WebSocketGateway({
  cors:{
    origin:'*'
  }
})
export class RoomGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomService: RoomService) {}

  // async handleConnection(socket) {
  //   const payload = <any>jwt.verify(token, APP_CONFIG.jwtSecret);
  //   const user: User = await this.jwtService.verify(
  //     socket.handshake.query.token,
  //     true
  //   );

  //   this.connectedUsers = [...this.connectedUsers, String(user._id)];

  //   // Send list of connected users
  //   this.server.emit('users', this.connectedUsers);
  // }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createRoom')
  create(@Request() req, @MessageBody() createRoomDto: CreateRoomDto) {
    const room = this.roomService.create(req.user.userId, createRoomDto);
    return room;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('findAllRooms')
  findAll(@Request() req) {
    return this.roomService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('findOneRoom')
  findOne(@MessageBody('_id') _id: string, @Request() req) {
    return this.roomService.findOne(req.user.userId,_id);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('test')
  test(@Request() req, @ConnectedSocket() client: Socket) {
    console.log(req.user.userId);
    console.log('test');//---------------
    client.emit('test', 'success');
    return "success";
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('updateRoom')
  update(@Request() req, @MessageBody() updateRoomDto: UpdateRoomDto) {
    // if(updateRoomDto.members.indexOf(req.user.userId) == -1){
    //   updateRoomDto.members.push(req.user.userId);
    // }
    return this.roomService.update(req.user.userId, updateRoomDto);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('removeRoom')
  remove(@Request() req, @MessageBody('_id') _id: string) {
    return this.roomService.remove(req.user.userId, _id);// ?
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: string,
    @Request() req,
    @ConnectedSocket() client: Socket
  ) {
    const id = req.user.userId;
    client.broadcast.emit('typing', { id, isTyping });
  }
}
