import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [UsersModule],
  providers: [EventsGateway],
})
export class EventsModule {}
