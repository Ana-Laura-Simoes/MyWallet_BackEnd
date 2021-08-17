import supertest from "supertest";
import { getConnection } from "typeorm";

import app, { init } from "../../src/app";
import { clearDatabase } from "../utils/database";
import * as userFactory from "../factories/userFactory";

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

describe("GET /transactions", () => {
    it("returns 200 for authenticated user", async () => {
      const result = await supertest(app)
        .get("/transactions")
        .set("Authorization", authHeader);
  
      expect(result.status).toEqual(200);
    });
  });