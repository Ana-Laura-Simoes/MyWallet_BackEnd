import express from 'express';
import cors from 'cors';
import pg from 'pg';
import joi from 'joi';
import dayjs from 'dayjs';
import {RegisterSchema} from "./schemas/RegisterSchema.js"

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;
const databaseConnection = {
    user: 'postgres',
    password: '105881',
    host: 'localhost',
    port: 5432,
    database: 'meubanco'
  };
const connection = new Pool(databaseConnection);




let data=[];

app.post("/entrance", async (req,res) => {

let {value,description}=req.body;    
let date=dayjs().format('DD/MM');   

value=Number(value).toFixed(2)
//console.log(value);

const errors = RegisterSchema.validate(req.body).error;
console.log(errors)
if(errors) {
    return res.sendStatus(400);
}




try{
    data.push({date:date,value:value,description:description,type:"entrance"});
    //console.log(data);

    await connection.query(`INSERT INTO registers (description, value, type) VALUES ($1, $2, $3)`, [description, value, "entrance"]);
    const result = await connection.query(`SELECT * FROM registers`, []);
    console.log(result.rows);
}catch(e){
    console.log(e);
    return res.sendStatus(500);
}
//console.log(value);

res.sendStatus(201);
});


app.post("/exit", async (req,res) => {
    let {value,description}=req.body;    
    let date=dayjs().format('DD/MM');
    value=Number(value).toFixed(2);
    
    
    const errors = RegisterSchema.validate(req.body).error;
    console.log(errors)
    if(errors) {
    
        return res.sendStatus(400);
    }
    
    try{
        data.push({date:date,value:value,description:description,type:"exit"});
        //console.log(data);
    
        await connection.query(`INSERT INTO registers (description, value, type) VALUES ($1, $2, $3)`, [description, value, "exit"]);
        const result = await connection.query(`SELECT * FROM registers`, []);
        console.log(result.rows);
    }catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
    //console.log(value);
    
    res.sendStatus(201);
    });


app.get("/menu", async (req,res) => {
    
    try{
return res.send(data);
    }catch{
        return sendStatus(500);
    }
    //console.log(value);
    
    res.send("ok");
    });








app.listen(4000, () =>{
    console.log("Rodando servidor");
});
