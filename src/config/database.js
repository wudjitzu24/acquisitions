import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// wczytaj .env z katalogu src
config({ path: './src/.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env');
}

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export { db, sql };