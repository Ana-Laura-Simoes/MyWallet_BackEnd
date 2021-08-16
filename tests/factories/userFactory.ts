
import bcrypt from "bcrypt";
import faker from "faker/locale/pt_BR";
import{ getRepository } from "typeorm";
import User from "../../src/entities/User";

interface user{
  name: string,
  email: string,
  password:string
}

export function generateValidBody():{name: string, email:string, password:string, confirmPassword:string} {
  const password= faker.internet.password(6);
  const body = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: password,
    confirmPassword: password
  }
  return body;
}
export async function createUser(user:user): Promise <User> {
  const {name,email,password}=user;
  const hashedPassword = bcrypt.hashSync(password,10);
  const newUser = await getRepository(User).create({name:name,email:email,password:hashedPassword});
  await getRepository(User).save(newUser);
  return newUser;
}