import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: './src/.env' });

// Parsowanie URL do osobnych wartości
const dbUrl = new URL(process.env.DATABASE_URL);

export default defineConfig({
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port || '5432', 10),
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1), // usuwa leading /
    ssl: dbUrl.searchParams.get('sslmode') === 'require',
  },
});