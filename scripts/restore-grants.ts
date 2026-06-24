import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('Restaurando permisos de los roles de Supabase API (anon, authenticated, service_role)...');

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
    console.log('Conexión establecida.');

    const query = `
      -- Otorgar uso del esquema public
      GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
      GRANT ALL ON SCHEMA public TO postgres, service_role;

      -- Otorgar permisos sobre tablas existentes
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
      GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

      -- Configurar privilegios por defecto para futuras tablas, secuencias y funciones
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
      
      -- Asegurar permisos para postgres en el esquema
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
    `;

    await client.query(query);
    console.log('¡Permisos y privilegios de Supabase restaurados exitosamente!');
  } catch (error) {
    console.error('Error restaurando permisos:', error);
  } finally {
    await client.end();
  }
}

main();
