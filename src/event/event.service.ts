import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './event.model';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event) private eventModel: typeof Event) {}

  async create(
    createEventDto: CreateEventDto,
    image?: Express.Request['file'],
  ) {
    let imageUrl = null;
    if (image) {
      const filename = `${uuidv4()}${path.extname(image.originalname)}`;
      const uploadPath = path.join(__dirname, '..', '..', 'uploads', filename);
      fs.writeFileSync(uploadPath, image.buffer);
      imageUrl = `/uploads/${filename}`;
    }

    return this.eventModel.create({
      title: createEventDto.title,
      description: createEventDto.description,
      imageUrl,
    });
  }

  findAll() {
    return this.eventModel.findAll();
  }

  findOne(id: number) {
    return this.eventModel.findByPk(id);
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
    image?: Express.Request['file'],
  ) {
    const event = await this.eventModel.findByPk(id);
    if (!event) {
      throw new Error(`Event #${id} not found`);
    }

    if (image) {
      const filename = `${uuidv4()}${path.extname(image.originalname)}`;
      const uploadPath = path.join(__dirname, '..', '..', 'uploads', filename);
      fs.writeFileSync(uploadPath, image.buffer);
      event.imageUrl = `/uploads/${filename}`;
    }

    await event.update(updateEventDto);
    return event;
  }

  async remove(id: number) {
    const event = await this.eventModel.findByPk(id);
    if (!event) {
      throw new Error(`Event #${id} not found`);
    }
    await event.destroy();
    return { message: `Event #${id} removed successfully` };
  }
}
