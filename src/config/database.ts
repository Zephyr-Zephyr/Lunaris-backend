import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Support DATABASE_URL (Railway/Heroku style) and local individual DB_* vars
let pool: Pool;

if (process.env.DATABASE_URL) {
  // In many platforms (Railway/Heroku) an SSL connection is required.
  const useSSL = process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true';

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  });

  console.log('Using DATABASE_URL for Postgres connection');
} else {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'lunaris_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  console.log('Using individual DB_HOST/DB_USER settings for Postgres connection');
}

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
