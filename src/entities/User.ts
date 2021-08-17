import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Transaction from "../entities/Transaction";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Transaction, (transactions) => transactions.user)
  transactions: Transaction[];
}
