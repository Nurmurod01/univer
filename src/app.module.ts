import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { NewsModule } from './news/news.module';
import { TeachersModule } from './teachers/teachers.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharedModule } from './common/shared.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    SharedModule,
    AdminModule,
    NewsModule,
    TeachersModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      database: 'postgres',
      username: 'postgres',
      password: '123456',
      host: '127.0.0.1',
      port: 5432,
      autoLoadModels: true,
      synchronize: true,
    }),
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
