import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'teacher' })
export class Teacher extends Model<Teacher> {
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
