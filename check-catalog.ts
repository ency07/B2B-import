import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables or .env file.');
  process.exit(1);
}

import { supabaseAdmin } from './src/utils/supabase';

async function main() {
  try {
    const { data: cats, error: errCats } = await supabaseAdmin
      .from('product_categories')
      .select('id, category_code, name')
      .is('deleted_at', null);

    console.log('--- CATEGORÍAS ---', errCats || '', cats);

    const { data: subcats, error: errSubs } = await supabaseAdmin
      .from('product_subcategories')
      .select('id, subcategory_code, name')
      .is('deleted_at', null);

    console.log('--- SUBCATEGORÍAS ---', errSubs || '', subcats);

    const { data: prods, error: errProds } = await supabaseAdmin
      .from('products')
      .select('id, product_code, name')
      .is('deleted_at', null);

    console.log('--- PRODUCTOS ---', errProds || '', prods);

  } catch (err: any) {
    console.error('Error:', err);
  }
}

main();
