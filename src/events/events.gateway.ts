import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { TRooms } from 'src/types/events';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  rooms: TRooms;

  @SubscribeMessage('messages')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    // console.log('server', this.server);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('rooms/join')
  roomsJoin(
    @MessageBody() { roomId, userId }: { roomId: string; userId: string },
  ) {
    this.server.socketsJoin(roomId);
    // this.rooms[roomId].users.push({ socketId: this.server. });
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
