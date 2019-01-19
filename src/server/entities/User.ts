import { IsEmail, Length } from "class-validator";
import {
  Column,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export default class User {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  @Index({ unique: true })
  @IsEmail()
  public email: string;

  @Column()
  public first: string;

  @Column()
  public last: string;

  @Column()
  @Length(6)
  public password: string;
}
