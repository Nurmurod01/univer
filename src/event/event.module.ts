import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './event.model';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [SequelizeModule.forFeature([Event]), AdminModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
