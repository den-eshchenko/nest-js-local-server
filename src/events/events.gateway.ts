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

  // @SubscribeMessage('rooms')
  // connection(client: Socket, userLogin: string) {
  //   const rooms = this.usersService.getAllRooms(userLogin);
  //   console.log(rooms);

  //   rooms.forEach((roomName) => {
  //     client.join(roomName);
  //   });

  //   client.to(client.id).emit('rooms', rooms);
  // }

  @SubscribeMessage('rooms/join')
  roomsJoin(
    client: Socket,
    { roomName, userLogin }: { roomName: string; userLogin: string },
  ) {
    client.join(roomName);
    this.usersService.addRoom(userLogin, roomName);

    client.to(roomName).emit(`rooms/joined`, userLogin);
  }

  @SubscribeMessage('rooms/message')
  roomsMessage(
    client: Socket,
    {
      roomName,
      userLogin,
      message,
    }: { roomName: string; userLogin: string; message: string },
  ) {
    const foundUser = this.usersService.getUserByName(userLogin);

    client.to(roomName).emit('rooms/message', {
      from: foundUser.login,
      email: foundUser.email,
      message,
    });
  }
}
