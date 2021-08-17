import { getRepository } from "typeorm";
import Transaction from "../entities/Transaction";

interface transaction {
    userId: number,
    date: string,
    value: any,
    description: string,
    type: string
}

export async function create (transaction: transaction){
    const {userId,date,value,description,type} = transaction
    const repository = getRepository(Transaction);
    await repository.insert({userId, date, description, value, type});
}
