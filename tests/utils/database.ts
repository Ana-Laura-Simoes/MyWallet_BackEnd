import {getManager } from "typeorm";

export async function clearDatabase () {
  await getManager().query(`TRUNCATE "users" RESTART IDENTITY CASCADE`);
}