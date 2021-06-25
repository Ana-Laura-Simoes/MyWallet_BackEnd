import express from 'express';
import cors from 'cors';
//import pg from 'pg';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import {RegisterSchema} from "../schemas/RegisterSchema.js";
import{SignUpSchema} from "../schemas/SignUpSchema.js";
import{SignInSchema} from "../schemas/SignInSchema.js";
import { v4 as uuid } from 'uuid';

import connection from './database/database.js';

const app = express();
app.use(cors());
app.use(express.json());

async function HandleData(data,res,type,userId){
    let {value,description}=data;    
    let date=dayjs().format('DD/MM');   
    
    value=Number(value).toFixed(2)
    
    
    const errors = RegisterSchema.validate(data).error;
   
    if(errors) {
        console.log(errors)
        return res.sendStatus(400);
    }
    
    try{
        const Description=description[0].toUpperCase()+description.substr(1);
        await connection.query(`INSERT INTO registers ("userId", date, description, value, type) VALUES ($1, $2, $3, $4, $5)`, [userId, date, Description, value, type]);
        const result = await connection.query(`SELECT * FROM registers`, []);
        
    }catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
    //console.log(value);
    
    return res.sendStatus(201);
}


app.post("/signUp", async(req,res)=>{
const {name,email,password, confirmPasswor}=req.body;

const errors = SignUpSchema.validate(req.body).error;

if(errors) {
    console.log(errors)
    return res.sendStatus(400);
}

try{
    const validation = await connection.query('SELECT * FROM users WHERE email = $1',[email]);
    if(validation.rows.length!==0){
        return res.sendStatus(409);
    }

const encryptedPassword = bcrypt.hashSync(password, 10);


await connection.query(`
INSERT INTO users
(name, email, password)
VALUES ($1, $2, $3)
`,[name, email,encryptedPassword]);

return res.sendStatus(201);
}
catch(e){
    console.log(e);
    return res.sendStatus(500);
}

});

app.post("/signIn", async (req, res) => {
    const { email, password } = req.body;

    const errors = SignInSchema.validate(req.body).error;

if(errors) {
    console.log(errors)
    return res.sendStatus(400);
}
 
    try{
    const result = await connection.query(`
        SELECT * FROM users
        WHERE email = $1
    `,[email]);

    const user = result.rows[0];
   
    if(result.rows.length>0 && bcrypt.compareSync(password, user.password)) {
        
        const token = uuid();

        await connection.query(`
        INSERT INTO sessions ("userId", token)
        VALUES ($1, $2)
      `, [user.id, token]);

        return res.send({
            id:user.id,
            name:user.name,
            email:user.email,
            token:token
        });
    } else {
        return res.sendStatus(401);
    }
}
catch(e){
    console.log(e)
    res.sendStatus(500);
}
});



app.delete("/logOut", async (req,res) => {
    const authorization = req.headers['authorization'];
    const token = authorization?.replace('Bearer ', '');    
    if(!token) return res.sendStatus(400);
    try{
    const result = await connection.query(`
    SELECT * FROM sessions
    JOIN users
    ON sessions."userId" = users.id
    WHERE sessions.token = $1
  `, [token]);

  const user = result.rows[0];
  
  if(user) {
    const deleteToken = await connection.query(`
    DELETE FROM sessions WHERE sessions.token = $1
  `, [token]);
  return res.sendStatus(200);

  } else {
    res.sendStatus(401);
  }
}catch(e){
    console.log(e);
    return res.sendStatus(500);
}
    });






app.post("/entrance", async (req,res) => {
    const authorization = req.headers['authorization'];
    const token = authorization?.replace('Bearer ', '');
    
    if(!token) return res.sendStatus(400);
try{
    const result = await connection.query(`
    SELECT * FROM sessions
    JOIN users
    ON sessions."userId" = users.id
    WHERE sessions.token = $1
  `, [token]);

  const user = result.rows[0];
  
  if(user) {
    HandleData(req.body,res,"entrance",user.id);
  } else {
    res.sendStatus(401);
  }
}
catch(error){
    console.log(error);
    return res.sendStatus(500);
}

});


app.post("/exit", async (req,res) => {
    const authorization = req.headers['authorization'];
    const token = authorization?.replace('Bearer ', '');
    
    if(!token) return res.sendStatus(400);

    try{
    const result = await connection.query(`
    SELECT * FROM sessions
    JOIN users
    ON sessions."userId" = users.id
    WHERE sessions.token = $1
  `, [token]);

  const user = result.rows[0];
  
  if(user) {
    HandleData(req.body,res,"exit",user.id);
  } else {
    return res.sendStatus(401);
  }}
  catch(e){
console.log(e);
return res.sendStatus(500);
  }
    });


app.get("/home", async (req,res) => {
    const authorization = req.headers['authorization'];
    const token = authorization?.replace('Bearer ', '');
    
    if(!token) return res.sendStatus(400);

    try{
    const TokenResult = await connection.query(`
    SELECT * FROM sessions
    JOIN users
    ON sessions."userId" = users.id
    WHERE sessions.token = $1
  `, [token]);

  const user = TokenResult.rows[0];
    
    
  if(user){        
        const result = await connection.query(`SELECT * FROM registers WHERE "userId" = $1`, [user.id]);    
        let balance=0;

        const exits= [];
        result.rows.forEach((r)=>{
            if(r.type==="exit") {
                balance=balance-Number(r.value),
                exits.push(r)
            }});
        const entrances = [];
        
        result.rows.forEach((r)=>{
            if(r.type==="entrance") {
                balance=balance+Number(r.value),
                entrances.push(r)
            }});
         
        const registers={bankStatement:[...exits,...entrances],balance:balance};
        return res.send(registers);
       
    }
    else {
        res.sendStatus(401);
      }
    }catch(e){
        console.log(e)
        return res.sendStatus(500);
    }
    });


export default app;


