/**
 * apply-patch.ts
 * Aplica UN archivo de migración SQL de forma incremental (sin DROP SCHEMA).
 * Uso: npx ts-node scripts/apply-patch.ts <nombre-del-archivo.sql>
 */
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const [,, fileName] = process.argv;
  if (!fileName) {
    console.error('Uso: npx ts-node scripts/apply-patch.ts <nombre-del-archivo.sql>');
    process.exit(1);
  }

  const sqlPath = path.isAbsolute(fileName)
    ? fileName
    : path.join(__dirname, '../supabase/migrations', fileName);

  if (!fs.existsSync(sqlPath)) {
    console.error(`Error: No se encontró el archivo: ${sqlPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log(`\n🔄  Aplicando parche: ${path.basename(sqlPath)} (${sql.length} bytes)\n`);

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
    ssl: { rejectUnauthorized: true }
  });

  try {
    await client.connect();
    console.log('✅  Conexión establecida.');

    await client.query(sql);
    console.log('✅  Parche aplicado exitosamente.');
  } catch (err: any) {
    console.error('❌  Error al aplicar el parche:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
