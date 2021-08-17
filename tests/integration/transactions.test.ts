import supertest from "supertest";
import { getConnection } from "typeorm";

import app, { init } from "../../src/app";
import { clearDatabase } from "../utils/database";
import * as userFactory from "../factories/userFactory";
import * as transactionFactory from "../factories/transactionFactory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await getConnection().close();
});

const agent = supertest(app);

async function createValidUser() {
  const body = userFactory.generateValidBody();
  await userFactory.createUser(body);
  const token = await userFactory.createSession(1); 
  return token;
}

describe("GET /transactions", () => {

  it("returns 401 for invalid token", async () => {
    const response = await supertest(app).get("/transactions").set('Authorization', `Bearer invalidToken`);
    expect(response.status).toEqual(401);    
});

    it("returns 200 for authenticated user", async () => {
      const token = await createValidUser();
      const result = await supertest(app)
        .get("/transactions")
        .set("Authorization",`Bearer ${token}`);
      expect(result.status).toEqual(200);
      expect(result.body).toEqual(
        expect.objectContaining({
            "bankStatement": expect.any(Array), "balance": expect.any(Number)
        }));
});
});


describe("POST /entrance", () => {
  it("returns 401 for invalid token", async () => {
      const result= await supertest(app).post("/entrance").set('Authorization', `Bearer invalidToken`);
      expect(result.status).toEqual(401);    
});

it("returns 200 for authenticated user", async () => {
  const token = await createValidUser();
  const body = await transactionFactory.generateValidBody();
  
  const beforeTransaction = await transactionFactory.getTransactions(1);
  expect(beforeTransaction.length).toEqual(0);

  const result = await supertest(app)
    .post("/entrance")
    .send(body)
    .set("Authorization",`Bearer ${token}`);
  expect(result.status).toEqual(201);

  const afterTransaction = await transactionFactory.getTransactions(1);
  expect(afterTransaction.length).toEqual(1);
});


it("returns 400 for empty body", async () => {
  const token = await createValidUser();
  const result = await supertest(app)
    .post("/entrance")
    .send({})
    .set("Authorization",`Bearer ${token}`);
  expect(result.status).toEqual(400);
});

it("returns 400 for invalid invalid body", async () => {
  const token = await createValidUser();
  const body = await transactionFactory.generateInvalidBody();
    const response = await supertest(app).post("/entrance").send(body).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(400);

});
});


describe("POST /exit", () => {
  it("returns 401 for invalid token", async () => {
      const result= await supertest(app).post("/exit").set('Authorization', `Bearer invalidToken`);
      expect(result.status).toEqual(401);    
});

it("returns 200 for authenticated user", async () => {
  const token = await createValidUser();
  const body = await transactionFactory.generateValidBody();
  
  const beforeTransaction = await transactionFactory.getTransactions(1);
  expect(beforeTransaction.length).toEqual(0);

  const result = await supertest(app)
    .post("/exit")
    .send(body)
    .set("Authorization",`Bearer ${token}`);
  expect(result.status).toEqual(201);

  const afterTransaction = await transactionFactory.getTransactions(1);
  expect(afterTransaction.length).toEqual(1);
});


it("returns 400 for empty body", async () => {
  const token = await createValidUser();
  const result = await supertest(app)
    .post("/exit")
    .send({})
    .set("Authorization",`Bearer ${token}`);
  expect(result.status).toEqual(400);
});

it("returns 400 for invalid invalid body", async () => {
  const token = await createValidUser();
  const body = await transactionFactory.generateInvalidBody();
    const response = await supertest(app).post("/exit").send(body).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(400);

});
});