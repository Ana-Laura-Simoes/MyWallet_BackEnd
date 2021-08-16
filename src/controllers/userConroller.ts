import { Request, Response } from "express";
import * as usersSchemas from "../schemas/usersSchemas";
import * as userService from "../services/userService";


interface user{
  name: string,
  email: string,
  password:string
}


export async function signUp(req:Request, res:Response) {
  
      const { name, email, password } : user = req.body;

      const validation = usersSchemas.signUpSchema.validate(req.body);

      if(validation.error) {
          return res.sendStatus(400);
      }        

      const user = await userService.SignUp({name,email,password});
     if(!user) return res.sendStatus(409);
     return res.sendStatus(201);
  }

