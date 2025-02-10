import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'news' })
export class News extends Model<News> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  description: string;
}
