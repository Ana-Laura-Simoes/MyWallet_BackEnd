import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import {RegisterSchema} from "./schemas/RegisterSchema.js";
import{SignUpSchema} from "./schemas/SignUpSchema.js";
import{SignInSchema} from "./schemas/SignInSchema.js";


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

async function HandleData(data,res,type){
    let {value,description}=data;    
    let date=dayjs().format('DD/MM');   
    
    value=Number(value).toFixed(2)
    //console.log(value);
    
    const errors = RegisterSchema.validate(data).error;
    console.log(errors)
    if(errors) {
        return res.sendStatus(400);
    }
    
    try{
        await connection.query(`INSERT INTO registers (date, description, value, type) VALUES ($1, $2, $3, $4)`, [date, description, value, type]);
        const result = await connection.query(`SELECT * FROM registers`, []);
        console.log(result.rows);
    }catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
    //console.log(value);
    
    res.sendStatus(201);
}


app.post("/signUp", async(req,res)=>{
const {name,email,password}=req.body;

const errors = SignUpSchema.validate(req.body).error;
console.log(errors)
if(errors) {
    return res.sendStatus(400);
}

const encryptedPassword = bcrypt.hashSync(password, 10);

try{
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
    console.log(user);

    if(result.rows.length>0 && bcrypt.compareSync(password, user.password)) {
        return res.send({
            id:user.id,
            name:user.name,
            email:user.email
        });
    } else {
        return res.sendStatus(404);
    }
}
catch(e){
    console.log(e)
    res.sendStatus(500);
}
});


app.post("/entrance", async (req,res) => {
HandleData(req.body,res,"entrance");

});


app.post("/exit", async (req,res) => {
    HandleData(req.body,res,"exit");
    });


app.get("/menu", async (req,res) => {
    
    try{
        const result = await connection.query(`SELECT * FROM registers`, []);    
        const exits= result.rows.filter((r)=>{if(r.type==="exit")return r});
        const entrances = result.rows.filter((r)=>{if(r.type==="entrance")return r});
        const registers=[...exits,...entrances];

        return res.send(registers);
    }catch(e){
        console.log(e)
        return res.sendStatus(500);
    }
    });








app.listen(4000, () =>{
    console.log("Rodando servidor");
});
