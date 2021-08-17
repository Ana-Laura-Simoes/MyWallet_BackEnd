import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Double } from "typeorm";
import User from "../entities/User";

@Entity("transactions")
export default class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  date: string;

  @Column()
  type: string;
  
  @Column()
  description: string;

  @Column()
  value: string;

  @ManyToOne(() => User, user => user.transactions)
  user: User;

  
}
