import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto, UpdateMessageDto} from './dto/message.dto';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@WebSocketGateway({
  cors:{
    origin:'*'
  }
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createMessage')
  create(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = this.messagesService.create(createMessageDto);
    this.server.emit('message', message);
    return message;
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody('roomId') roomId: string) {
    return this.messagesService.findAll(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: string,
    @ConnectedSocket() client: Socket,
  ) {
    const id = client.id;
    client.broadcast.emit('typing', { id, isTyping });
  }
}
