import app from '../src/app.js';
import supertest from 'supertest';
import connection from '../src/database/database.js'

import { login } from './util';

beforeEach(async () => {
    await connection.query(`DELETE FROM users`);
    await connection.query(`DELETE FROM registers`);
  });
  
  afterAll(() => {
    connection.end();
  });


describe("POST /entrance", () => {
    it("returns 401 for invalid token", async () => {

        const response = await supertest(app).post("/entrance").set('Authorization', `Bearer token123`);
        expect(response.status).toEqual(401);    
  });
  
  it("returns 400 for null token", async () => {
  
      const response = await supertest(app).post("/entrance");
      expect(response.status).toEqual(400);    
  });

  it("returns 201 for valid token", async () => {
    const token = await login();
    const body = {
        value: 1200,
       description: 'salário'
      };
  
      const response = await supertest(app).post("/entrance").send(body).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toEqual(201);

  });

  it("returns 400 for invalid params(unfilled field)", async () => {
    const token = await login();
    const body = {
        value: '1200',
       description: ''
      };
  
      const response = await supertest(app).post("/entrance").send(body).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toEqual(400);

  });

  it("returns 400 for invalid params(NAN)", async () => {
    const token = await login();
    const body = {
        value: '#5.',
       description: 'salário'
      };
  
      const response = await supertest(app).post("/entrance").send(body).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toEqual(400);

  });
  });







  describe("POST /exit", () => {
    it("returns 401 for invalid token", async () => {

        const response = await supertest(app).post("/exit").set('Authorization', `Bearer token123`);
        expect(response.status).toEqual(401);    
  });
  
  it("returns 400 for null token", async () => {
  
      const response = await supertest(app).post("/exit");
      expect(response.status).toEqual(400);    
  });

  it("returns 201 for valid token", async () => {
    const token = await login();
    const body = {
        value: 55.60,
       description: 'ifood'
      };
  
      const response = await supertest(app).post("/exit").send(body).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toEqual(201);

  });

  it("returns 400 for invalid params(unfilled field)", async () => {
    const token = await login();
    const body = {
        value: '55.60',
       description: ''
      };
  
      const response = await supertest(app).post("/exit").send(body).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toEqual(400);

  });

  it("returns 400 for invalid params(NAN)", async () => {
    const token = await login();
    const body = {
        value: '#5.',
       description: 'ifood'
      };
  
      const response = await supertest(app).post("/exit").send(body).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toEqual(400);

  });
  });


  describe("GET / home", () => {

    it("returns 401 for invalid token", async () => {

        const response = await supertest(app).get("/home").set('Authorization', `Bearer token123`);
        expect(response.status).toEqual(401);    
  });
  
  it("returns 400 for null token", async () => {
  
      const response = await supertest(app).get("/home");
      expect(response.status).toEqual(400);    
  });


    it("should respond with status 200", async () => {
      const token = await login();
    
        const response = await supertest(app).get("/home").set('Authorization', `Bearer ${token}`);
    
        expect(JSON.parse(response.text)).toEqual(
            expect.objectContaining({
                "bankStatement": expect.any(Array), "balance": expect.any(Number)
            })

    );
    });



  });
  
