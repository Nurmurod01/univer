import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'event' })
export class Event extends Model<Event> {
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
