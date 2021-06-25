
import supertest from 'supertest';

import app from '../src/app.js';

export async function login () {
    const signUp = {
        name: 'joaozinho',
        email: 'j.@gmail.com',
        password: '1',
        confirmPassword:'1'
      };
    
      const result = await supertest(app).post("/signUp").send(signUp);
      
  const body = {
    email: 'j.@gmail.com',
    password: '1'
  };        
  const user = await supertest(app).post("/signIn").send(body);
  
  const {token}=user.body;
  return token;
}