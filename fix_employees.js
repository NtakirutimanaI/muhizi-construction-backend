const {Client} = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres.jarjljlarffltchcnjjr:nxYjS6Mfw7uTtiyE@aws-1-eu-north-1.pooler.supabase.com:5432/postgres',
  ssl: {rejectUnauthorized: false}
});
(async () => {
  await c.connect();
  
  // Add workShift column
  await c.query('ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "workShift" character varying');
  console.log('Added workShift column to employees');
  
  // Make email nullable (entity says nullable: true but DB has NOT NULL)
  await c.query('ALTER TABLE "employees" ALTER COLUMN "email" DROP NOT NULL');
  console.log('Made email column nullable in employees');
  
  // Verify
  const cols = await c.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name='employees' ORDER BY ordinal_position");
  console.log('Employees columns after fix:', JSON.stringify(cols.rows, null, 2));
  
  await c.end();
  console.log('Done!');
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
