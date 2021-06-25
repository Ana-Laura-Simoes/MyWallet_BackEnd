import pg from 'pg';

const { Pool } = pg;
const databaseConnection = {
    user: 'postgres',
    password: '105881',
    host: 'localhost',
    port: 5432,
    database: process.env.NODE_ENV === "test" ? "meubancotest" : "meubanco"
  };
const connection = new Pool(databaseConnection);

export default connection;