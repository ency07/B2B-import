import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
    console.error('Error: DB_HOST and DB_PASSWORD must be set in environment variables or .env file.');
    process.exit(1);
  }

  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'postgres',
    ssl: {
      rejectUnauthorized: true
    }
  });

  try {
    await client.connect();
    console.log('¡Conectado!');

    const res1 = await client.query("SELECT current_user, session_user;");
    console.log('Users:', res1.rows);

    await client.end();
  } catch (err: any) {
    console.error('Error:', err);
  }
}

main();
