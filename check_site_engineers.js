const {Client} = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres.jarjljlarffltchcnjjr:nxYjS6Mfw7uTtiyE@aws-1-eu-north-1.pooler.supabase.com:5432/postgres',
  ssl: {rejectUnauthorized: false}
});
(async () => {
  await c.connect();
  const users = await c.query("SELECT id, email, role FROM users WHERE role='site_engineer' LIMIT 3");
  console.log('Site engineers:', JSON.stringify(users.rows));
  await c.end();
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
