import app from '../src/app.js';
import supertest from 'supertest';
import connection from '../src/database/database.js'

beforeAll(async () => {
    await connection.query(`DELETE FROM users`);
  });

afterAll(async() => {
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


    it("returns 400 for invalid params(unfilled field)", async () => {
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
    
    it("returns 400 for invalid params(diferent passwords)", async () => {
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

describe("POST /signIn", () => {
    it("returns 201 for valid params", async () => {
        const body = {
            email: 'j.@gmail.com',
            password: '1'
          };        
          const result = await supertest(app).post("/signIn").send(body);
          const status = result.status;
          //console.log(result.text);

          
          expect(JSON.parse(result.text)).toEqual(
            expect.objectContaining({
                "email": "j.@gmail.com", "id": expect.any(Number), "name": "joaozinho", "token" : expect.any(String)
            })

    );
});


    it("returns 400 for invalid params(unfilled field)", async () => {
        const body = {
            email: 'j.@gmail.com',
            password: '',
          };
        
          const result = await supertest(app).post("/signIn").send(body);
          const status = result.status;
          
          expect(status).toEqual(400);
    });


    it("returns 401 for invalid user params", async () => {
        const body = {
            email: 'j.@gmail.',
            password: '1',
          };
        
          const result = await supertest(app).post("/signIn").send(body);
          const status = result.status;
          
          expect(status).toEqual(401);
    });
    

});


/*
describe("DELETE /logOut", () => {
    it("returns 200 for valid token", async () => {
        const body = {
            email: 'j.@gmail.com',
            password: '1'
          };        
          const user = await supertest(app).post("/signIn").send(body);
          
          const {token}=user.body;
          console.log(token);

          const response = await supertest(app).delete("/logOut").set('Authorization', `Bearer ${token}`);
          expect(response.status).toEqual(200);    
});

it("returns 401 for invalid token", async () => {

      const response = await supertest(app).delete("/logOut").set('Authorization', `Bearer token123`);
      expect(response.status).toEqual(401);    
});

it("returns 400 for null token", async () => {

    const response = await supertest(app).delete("/logOut");
    expect(response.status).toEqual(400);    
});

});
*/