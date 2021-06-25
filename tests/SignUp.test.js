import app from '../src/app.js';
import supertest from 'supertest';
import connection from '../src/database/database.js'

describe("POST /signUp", () => {
    it("returns 201 for valid params", async () => {
        const body = {
            name: 'josi',
            email: 'j.@gmail.com',
            password: '1',
            confirmPassword:'1'
          };
        
          const result = await supertest(app).post("/signUp").send(body);
          const status = result.status;
          
          expect(status).toEqual(201);
    });
});