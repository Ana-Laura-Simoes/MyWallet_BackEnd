import pg from 'pg';

const { Pool } = pg;
const databaseConnection = {
    user: 'postgres',
    password: '105881',
    host: 'localhost',
    port: 5432,
    database: 'meubanco'
  };
const connection = new Pool(databaseConnection);

export default connection;