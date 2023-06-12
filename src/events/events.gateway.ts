import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private usersService: UsersService) {}

  @SubscribeMessage('rooms/connect')
  connection(client: Socket, userLogin: string) {
    const rooms = this.usersService.getRooms(userLogin);

    Object.keys(rooms).forEach((roomName) => {
      client.join(roomName);
    });
  }

  @SubscribeMessage('rooms/join')
  roomsJoin(
    client: Socket,
    { roomName, userLogin }: { roomName: string; userLogin: string },
  ) {
    const joinMessage = this.usersService.addRoom(userLogin, roomName);

    client.join(roomName);
    this.server
      .to(roomName)
      .emit('rooms/joined', { roomName, message: joinMessage });
  }

  @SubscribeMessage('rooms/message')
  roomsMessage(
    _: Socket,
    {
      roomName,
      userLogin,
      message,
    }: { roomName: string; userLogin: string; message: string },
  ) {
    const foundUser = this.usersService.getUserByName(userLogin);
    this.usersService.addMessage({
      message: {
        email: foundUser?.email,
        message,
        userLogin,
      },
      roomName,
      userLogin,
    });

    this.server.to(roomName).emit('rooms/message', {
      roomName,
      userLogin: foundUser?.login,
      email: foundUser?.email,
      message,
    });
  }
}
