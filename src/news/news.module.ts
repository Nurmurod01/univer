import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { News } from './news.model';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [SequelizeModule.forFeature([News]), AdminModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
