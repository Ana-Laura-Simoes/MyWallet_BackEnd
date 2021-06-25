import app from '../src/app.js';
import supertest from 'supertest';
import connection from '../src/database/database.js'

beforeAll(async () => {
    await connection.query(`DELETE FROM users`);
  });

afterAll(() => {
    connection.end();
});

describe("POST /signUp", () => {
    it("returns 201 for valid params", async () => {
        const body = {
            name: 'joaozinho',
            email: 'j.@gmail.com',
            password: '1',
            confirmPassword:'1'
          };
        
          const result = await supertest(app).post("/signUp").send(body);
          const status = result.status;
          
          expect(status).toEqual(201);
    });


    it("returns 400 for invalid params", async () => {
        const body = {
            name: 'joaozinho',
            email: 'j.@gmail.com',
            password: '',
            confirmPassword:'3'
          };
        
          const result = await supertest(app).post("/signUp").send(body);
          const status = result.status;
          
          expect(status).toEqual(400);
    });
    
    it("returns 400 for invalid params", async () => {
        const body = {
            name: 'joaozinho',
            email: 'j.@gmail.com',
            password: '1',
            confirmPassword:'3'
          };
        
          const result = await supertest(app).post("/signUp").send(body);
          const status = result.status;
          
          expect(status).toEqual(400);
    });

    it("returns 409 for duplicated email", async () => {
        const body = {
            name: 'juju',
            email: 'j.@gmail.com',
            password: '3',
            confirmPassword:'3'
          };
        
          const result = await supertest(app).post("/signUp").send(body);
          const status = result.status;
          
          expect(status).toEqual(409);
    });
});