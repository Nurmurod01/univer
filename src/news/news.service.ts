import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { News } from './news.model';
import { log } from 'console';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News) private newsModel: typeof News) {}

  async create(createNewsDto: CreateNewsDto, image?: Express.Multer.File) {
    console.log('createNewsDto:', createNewsDto);

    let imageUrl = null;
    if (image) {
      const filename = `${uuidv4()}${path.extname(image.originalname)}`;
      const uploadPath = path.join(__dirname, '..', '..', 'uploads', filename);
      fs.writeFileSync(uploadPath, image.buffer);
      imageUrl = `/uploads/${filename}`;
    }

    return this.newsModel.create({
      title: createNewsDto.title,
      description: createNewsDto.description,
      imageUrl,
    });
  }
  findAll() {
    return this.newsModel.findAll();
  }

  findOne(id: number) {
    return this.newsModel.findByPk(id);
  }

  async update(
    id: number,
    updateNewsDto: UpdateNewsDto,
    image?: Express.Request['file'],
  ) {
    const event = await this.newsModel.findByPk(id);
    if (!event) {
      throw new Error(`Event #${id} not found`);
    }

    if (image) {
      const filename = `${uuidv4()}${path.extname(image.originalname)}`;
      const uploadPath = path.join(__dirname, '..', '..', 'uploads', filename);
      fs.writeFileSync(uploadPath, image.buffer);
      event.imageUrl = `/uploads/${filename}`;
    }

    await event.update(updateNewsDto);
    return event;
  }

  async remove(id: number) {
    const event = await this.newsModel.findByPk(id);
    if (!event) {
      throw new Error(`Event #${id} not found`);
    }
    await event.destroy();
    return { message: `Event #${id} removed successfully` };
  }
}
