import { AppDataSource } from './src/database/data-source';

async function run() {
    const ds = await AppDataSource.initialize();
    console.log('Connected');

    await ds.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "basicSalary" decimal(12,2) DEFAULT 0`);
    console.log('Added basicSalary to users');

    await ds.query(`CREATE TABLE IF NOT EXISTS "insurance_settings" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "provider" character varying NOT NULL,
        "label" character varying NOT NULL,
        "employeeAmount" decimal(12,2) DEFAULT 0,
        "employerAmount" decimal(12,2) DEFAULT 0,
        "description" text,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamptz DEFAULT now(),
        "updatedAt" timestamptz DEFAULT now()
    )`);
    console.log('Created insurance_settings table');

    await ds.destroy();
    console.log('Done');
}

run().catch(e => { console.error(e); process.exit(1); });
