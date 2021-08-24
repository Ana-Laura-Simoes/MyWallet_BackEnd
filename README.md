# API My Wallet

An easy to use financial manager. Track your revenues and expenses to learn how you spend your money and know all the time how much you have.

## About

This is an API for a web application with which lots of people can manage their own expenses and revenues. Below are the implemented features:

- Sign Up
- Login
- List all financial events for a user
- Add expense
- Add revenue

By using this app any user can learn how they've been using their money and always keep track of your balance.

## Technologies
The following tools and frameworks were used in the construction of the project:<br>
  
  ![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)&nbsp;
  ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)&nbsp;
  ![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)&nbsp;
  ![PostgresSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)&nbsp;
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)&nbsp;
  
## How to run

1. Clone the front-end repository at https://github.com/Ana-Laura-Simoes/my-wallet
2. Follow instructions to run front-end at https://github.com/Ana-Laura-Simoes/my-wallet
3. Clone this repository
4. Open the folder created
```bash
cd my-wallet-back
```
5. Install the dependencies
```bash
npm i
```
6. Create a new postgres database
7. Set the environment variables :
    - Create a ``.env`` file in the folder root
    - Copy the content of the ``.env.example`` into it
    - Set the ``DATABASE_URL`` in this format: "postgres://user:password@host:port/databaseName"
    - Set the ``PORT`` for 4000
    
8. Create the database's tables
```bash
npm build
```
```bash
npm run typeorm migration:run
```

9. Finally run the back-end with
```bash
npm run dev
```
10. Your server should be running now

## How to run the tests
1. Create a postgres database to run the tests (replace databaseName with the name of your current database)
```bash
CREATE DATABASE databaseName_test TEMPLATE databaseName;
```
2. Set the enviroment variables, with the following changes:
    - Create a ``.env.test`` file in the folder root
    - Copy the content of the ``.env`` into it
    - Set the ``DATABASE_URL`` in this format: "postgres://user:password@host:port/databaseName_test"
 
3. Run the tests with
```bash
npm run test
``` 
