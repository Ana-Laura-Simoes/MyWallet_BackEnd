//import app from '../src/app.js';
import supertest from 'supertest';
//import connection from '../src/database/database.js'

describe("POST /receitas", () => {
    it("returns 201 for valid params", () => {
        // ... chamar a rota e pegar o status
        // ex: supondo que o status tenha retornado 201
        const status = 201;
        
        expect(status).toEqual(201);
    });
});