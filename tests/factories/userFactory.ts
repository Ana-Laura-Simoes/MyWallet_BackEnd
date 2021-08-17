import bcrypt from "bcrypt";
import faker from "faker/locale/pt_BR";
import { getRepository } from "typeorm";
import User from "../../src/entities/User";
import Session from "../../src/entities/Session";

interface user {
  name: string;
  email: string;
  password: string;
}

export function generateValidBody(): {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
} {
  const password = faker.internet.password(6);
  const body = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: password,
    confirmPassword: password,
  };
  return body;
}
export async function createUser(user: user): Promise<User> {
  const { name, email, password } = user;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await getRepository(User).create({
    name: name,
    email: email,
    password: hashedPassword,
  });
  await getRepository(User).save(newUser);
  return newUser;
}

export async function createSession(userId: number): Promise<string> {
  const token = faker.internet.password();

  const repository = getRepository(Session);

  const result = await repository.insert({ token, userId });

  return token;
}

export async function getSessions(): Promise<Session[]> {
  const sessions = getRepository(Session).find();
  return sessions;
}

export async function lastSession(): Promise<Session> {
  const repository = getRepository(Session);
  const lastSession = await repository
    .createQueryBuilder("sessions")
    .orderBy("id", "ASC")
    .getOne();
  return lastSession;
}
