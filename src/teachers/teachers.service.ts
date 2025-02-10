import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Teacher } from './teacher.model';

@Injectable()
export class TeachersService {
  constructor(@InjectModel(Teacher) private teachersModel: typeof Teacher) {}

  async create(createNewsDto: CreateTeacherDto, image?: Express.Multer.File) {
    console.log('createNewsDto:', createNewsDto);

    let imageUrl = null;
    if (image) {
      const filename = `${uuidv4()}${path.extname(image.originalname)}`;
      const uploadPath = path.join(__dirname, '..', '..', 'uploads', filename);
      fs.writeFileSync(uploadPath, image.buffer);
      imageUrl = `/uploads/${filename}`;
    }

    return this.teachersModel.create({
      title: createNewsDto.title,
      description: createNewsDto.description,
      imageUrl,
    });
  }
  findAll() {
    return this.teachersModel.findAll();
  }

  findOne(id: number) {
    return this.teachersModel.findByPk(id);
  }

  async update(
    id: number,
    updateNewsDto: UpdateTeacherDto,
    image?: Express.Request['file'],
  ) {
    const event = await this.teachersModel.findByPk(id);
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
    const event = await this.teachersModel.findByPk(id);
    if (!event) {
      throw new Error(`Event #${id} not found`);
    }
    await event.destroy();
    return { message: `Event #${id} removed successfully` };
  }
}
