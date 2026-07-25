const {Client} = require('pg');
const c = new Client({
  connectionString: 'postgresql://postgres.jarjljlarffltchcnjjr:nxYjS6Mfw7uTtiyE@aws-1-eu-north-1.pooler.supabase.com:5432/postgres',
  ssl: {rejectUnauthorized: false}
});
(async () => {
  await c.connect();
  const tables = await c.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('employees','employee_assignments','construction_projects','sites') ORDER BY table_name");
  console.log('Tables found:', JSON.stringify(tables.rows));
  
  if (tables.rows.some(r => r.table_name === 'employees')) {
    const empCols = await c.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name='employees' ORDER BY ordinal_position");
    console.log('Employees columns:', JSON.stringify(empCols.rows));
  } else {
    console.log('EMPLOYEES TABLE DOES NOT EXIST');
  }
  
  if (tables.rows.some(r => r.table_name === 'employee_assignments')) {
    const assignCols = await c.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name='employee_assignments' ORDER BY ordinal_position");
    console.log('EmployeeAssignments columns:', JSON.stringify(assignCols.rows));
  } else {
    console.log('EMPLOYEE_ASSIGNMENTS TABLE DOES NOT EXIST');
  }

  await c.end();
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
