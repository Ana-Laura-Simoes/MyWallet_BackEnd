import { Request, Response } from "express";
import * as usersSchemas from "../schemas/usersSchemas";
import * as userService from "../services/userService";




export async function signUp(req:Request, res:Response) {
  
      const { name, email, password } = req.body as {name:string, email:string, password:string};

      const validation = usersSchemas.signUpSchema.validate(req.body);

      if(validation.error) {
          return res.sendStatus(400);
      }        

     const user = await userService.SignUp({name,email,password});
     if(!user) return res.sendStatus(409);
     return res.sendStatus(201);
  }



    export async function signIn(req:Request,res:Response){
      const {  email, password } = req.body as { email:string, password:string};
        const validation = usersSchemas.signInSchema.validate(req.body);
        
        if(validation.error) {
            return res.sendStatus(400);
        }
        
        const token = await userService.SignIn({email,password})
        if(!token){
          return res.sendStatus(401);
        }
       return res.send(token);   

    }

