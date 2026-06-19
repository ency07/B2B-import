import * as fs from 'fs';
import * as path from 'path';

function main() {
  const sqlPath = path.join(__dirname, '../supabase_combined_migrations.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  const offset = 343910;
  const start = Math.max(0, offset - 250);
  const end = Math.min(sql.length, offset + 250);
  
  console.log('--- SQL ALREDEDOR DEL OFFSET 343910 ---');
  console.log(sql.substring(start, end));
  console.log('---------------------------------------');
}

main();
