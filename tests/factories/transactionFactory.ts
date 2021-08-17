import faker from "faker/locale/pt_BR";
import { getRepository } from "typeorm";
import Transaction from "../../src/entities/Transaction";

export function generateValidBody() {
  const body = {
    value: faker.finance.amount(),
    description: faker.finance.transactionDescription(),
  };
  return body;
}

export function generateInvalidBody() {
  const body = {
    value: "1..90",
    description: faker.finance.transactionDescription(),
  };
  return body;
}

export async function getTransactions(userId: number): Promise<Transaction[]> {
  const transactions = getRepository(Transaction).find({ where: { userId } });
  return transactions;
}
