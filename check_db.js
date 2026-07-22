const { Client } = require('pg');
const c = new Client('postgresql://postgres.jarjljlarffltchcnjjr:nxYjS6Mfw7uTtiyE@aws-1-eu-north-1.pooler.supabase.com:5432/postgres');

async function run() {
  await c.connect();
  
  try {
    const migrations = await c.query("SELECT * FROM migrations ORDER BY timestamp");
    console.log('Migrations run (' + migrations.rows.length + '):');
    migrations.rows.forEach(r => console.log('  ' + r.timestamp + ' - ' + r.name));
  } catch(e) { console.error('Migration check error:', e.message); }

  // Check specifically the public.users table schema
  try {
    const cols = await c.query(`
      SELECT column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_name='users' AND table_schema='public' 
      ORDER BY ordinal_position
    `);
    console.log('\nPublic users table columns:');
    cols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type}, nullable=${r.is_nullable})`));
  } catch(e) { console.error('Users check error:', e.message); }

  await c.end();
}
run();
