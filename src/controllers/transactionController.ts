import { Request, Response } from "express";
import transactionSchema from "../schemas/transactionsSchemas";
import dayjs from "dayjs";
import * as transactionService from "../services/transactionService";

interface transaction {
    userId: number,
    value: any,
    description: string,
    type: any
}


export async function newTransactions (req:Request,res:Response)  {
    const userId  = res.locals.userId;
    const type =req.route.path;
    const transaction :transaction = {
        userId:userId,
        value: req.body.value,
        description:req.body.description,
        type: type.replace('/','')
       }
       const result = await validateAndCreateTransaction(transaction);
       if (!result) return res.sendStatus(400);
       
       return res.sendStatus(201);
  }

  export async function getTransactions(req:Request,res:Response){
    const userId  = res.locals.userId;
    const result = await transactionService.getById(userId);
    return res.send(result);    
  }
    

  async function validateAndCreateTransaction(transaction:transaction){
    const errors = transactionSchema.validate(transaction).error;
   
    if(errors) {
        console.log(errors)
        return false;
    }

    let {userId,value,description,type}=transaction;    
    let date=dayjs().format('DD/MM');   

    const adjustedValue = Number(value).toFixed(2);
        
    const adjustedDescription=description[0].toUpperCase()+description.substr(1);
    
    await transactionService.create({userId, value:adjustedValue ,description: adjustedDescription ,date,type})
       
    return true;
}
