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

describe("POST /sign-in", () => {
  function generateInValidBody() {
    return { email: "test@test.com", password: " password" };
  }

  it("returns status 400 for empty params", async () => {
    const body = {};

    const result = await agent.post("/sign-in").send(body);

    expect(result.status).toEqual(400);
  });

  it("returns status 200 for valid email and password", async () => {
    const user = await userFactory.generateValidBody();
    await userFactory.createUser(user);

    const body = { email: user.email, password: user.password };
    const result = await agent.post("/sign-in").send(body);

    expect(result.status).toEqual(200);
  });

  it("creates a new session for valid email and password", async () => {
    const user = await userFactory.generateValidBody();
    await userFactory.createUser(user);
    const body = { email: user.email, password: user.password };

    const beforeSessions = await userFactory.getSessions();
    expect(beforeSessions.length).toEqual(0);

    const result = await agent.post("/sign-in").send(body);

    const afterSessions = await userFactory.getSessions();
    expect(afterSessions.length).toEqual(1);
  });

  it("returns a valid session token for valid email and password", async () => {
    const user = await userFactory.generateValidBody();
    await userFactory.createUser(user);
    const body = { email: user.email, password: user.password };

    const result = await agent.post("/sign-in").send(body);

    const session = await userFactory.lastSession();

    expect(result.text).toEqual(session.token);
  });

  it("returns status 401 for inexistent email", async () => {
    const body = generateInValidBody();

    const result = await agent.post("/sign-in").send(body);

    expect(result.status).toEqual(401);
  });

  it("returns status 401 for wrong password", async () => {
    const user = await userFactory.generateValidBody();
    await userFactory.createUser(user);
    const body = { email: user.email, password: user.password + "_test" };
    const result = await agent.post("/sign-in").send(body);

    expect(result.status).toEqual(401);
  });
});

describe("POST /sign-in", () => {
  it("returns 401 for invalid token", async () => {
    const result = await supertest(app)
      .post("/sign-out")
      .set("Authorization", `Bearer invalidToken`);
    expect(result.status).toEqual(401);
  });
  it("returns status 200 for authenticated user", async () => {
    const user = userFactory.generateValidBody();
    await userFactory.createUser(user);
    const token = await userFactory.createSession(1);

    const beforeSignOut = await userFactory.getSessions();
    expect(beforeSignOut.length).toEqual(1);

    const result = await supertest(app)
      .post("/sign-out")
      .set("Authorization", `Bearer ${token}`);
    expect(result.status).toEqual(200);

    const AfterSessions = await userFactory.getSessions();
    expect(AfterSessions.length).toEqual(0);
  });
});
