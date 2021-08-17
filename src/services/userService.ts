import { getRepository,getConnection } from "typeorm";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import Session from "../entities/Session";
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
export async function SignIn(user:{email:string, password:string}){
  const existingUser = await getByEmail(user.email);
  if(!existingUser) {
    return false
  }
   
  if(bcrypt.compareSync(user.password,existingUser.password)){
    const token = uuid();
    await createSession(existingUser.id,token);
    return token;
  }
  else {
    return false
  }
}

export async function validateSession(token:string){
  const repository = getRepository(Session);
  const session = await repository.findOne({
    where:{token}, relations: ["user"] });
    if(!session) {
      return false;
    } else {
      return session.user;
    }
}

export async function deleteSession (token:string,userId:number){
  
  const result = await getConnection()
  .createQueryBuilder()
  .delete()
  .from(Session)
  .where("token = :token", { token })
  .execute();

return result;
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

async function createSession(userId:number, token:string) {
  const repository = getRepository(Session);
  const result = await repository.insert({token,userId});
  return result;
}

