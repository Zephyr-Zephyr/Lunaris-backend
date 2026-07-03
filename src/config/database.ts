import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'lunaris_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

pool.on('error', (err: any) => {
  console.error('Unexpected error on idle client', err);
});

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
  const start = Date.now();
  return pool.query(text, params).then((res: QueryResult) => {
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  });
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default pool;
