import { Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcrypt";

import User from "../entities/User";

interface user{
  name:string;
  email: string,
  password:string
}

export async function SignUp(user:user):Promise <Boolean> {
  const conflictedUser = await getByEmail(user.email);
  if(conflictedUser) return false;

  else{
    await create(user);
    return true; 
  }
}

async function create(newUser:user) {
  const {name,email,password} = newUser;
  const repository = getRepository(User);
  const hashedPassword = bcrypt.hashSync(password,10);
  await repository.insert({name,email,password:hashedPassword});
}

async function getByEmail(email: string) :Promise <User> {
  const result = await getRepository(User).findOne({
    where: { email }
  });
  return result;
}
