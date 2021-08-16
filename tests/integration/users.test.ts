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

describe("POST /sign-up", () => {


  it("returns status 400 for empty params", async () => {
    const body = {};

    const result = await agent.post("/sign-up").send(body);

    expect(result.status).toEqual(400);
  });

  it("returns status 201 for valid params", async () => {
    const body = userFactory.generateValidBody();

    const result = await agent.post("/sign-up").send(body);

    expect(result.status).toEqual(201);
  });

  it("returns status 409 for conflicted email", async () => {
    const body = userFactory.generateValidBody();
    await userFactory.createUser(body);
    const result = await agent.post("/sign-up").send(body);
    expect(result.status).toEqual(409);
  });
});

