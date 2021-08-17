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

export async function getById (userId:number){
    const repository = getRepository(Transaction);
    const result = await repository.createQueryBuilder('transactions')
    .where({userId})
    .orderBy('id','DESC').getMany();
     
    const transactions = organizeTransactions(result);

    return transactions;
}

export async function organizeTransactions(transactions:Transaction[]) {
    let balance=0;

    const exits:Transaction[]= [];
    
    transactions.forEach((r)=>{
            if(r.type==="exit") {
                balance=balance-Number(r.value),
                exits.push(r)
            }});

    const entrances:Transaction[] = [];
        
        transactions.forEach((r)=>{
            if(r.type==="entrance") {
                balance=balance+Number(r.value),
                entrances.push(r)
            }});
         
        const registers={bankStatement:[...exits,...entrances],balance:balance};
        return (registers);
}
