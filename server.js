import express from 'express';
import cors from 'cors';
import pg from 'pg';
import joi from 'joi';
import dayjs from 'dayjs';

const app = express();
app.use(cors());
app.use(express.json());

/*const { Pool } = pg;
const databaseConnection = {
    user: 'bootcamp_role',
    password: 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp',
    host: 'localhost',
    port: 5432,
    database: 'boardcamp'
  };
const connection = new Pool(databaseConnection);
*/



let data=[];





app.post("/entrance", async (req,res) => {
let {value,description}=req.body;    
let date=dayjs().format('DD/MM');
if(!value.includes(".")) value=value + ".00"


const userSchema = joi.object({
    value: joi.number().greater(0).required(),
    description: joi.string().min(1).required()
});

const { error} = userSchema.validate({
    value: value, 
    description: description
});

if(error){
    console.log(error);
    return res.sendStatus(400);
}

try{
    data.push({date:date,value:value,description:description,type:"entrance"});
    console.log(data);
}catch{
    return sendStatus(500);
}
//console.log(value);

res.send("ok");
});


app.post("/exit", async (req,res) => {
    let {value,description}=req.body;    
    let date=dayjs().format('DD/MM');
    if(!value.includes(".")) value=value + ".00"
    
    
    const userSchema = joi.object({
        value: joi.number().greater(0).required(),
        description: joi.string().min(1).required()
    });
    
    const { error} = userSchema.validate({
        value: value, 
        description: description
    });
    
    if(error){
        console.log(error);
        return res.sendStatus(400);
    }
    
    try{
        data.push({date:date,value:value,description:description,type:"exit"});
        console.log(data);
    }catch{
        return sendStatus(500);
    }
    //console.log(value);
    
    res.send("ok");
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
