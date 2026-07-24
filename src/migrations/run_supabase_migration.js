const { Client } = require('pg');
require('dotenv').config();

const sql = `
-- 1. Create petty_cash_funds table
CREATE TABLE IF NOT EXISTS petty_cash_funds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "fundCode" VARCHAR NOT NULL UNIQUE,
    "fundName" VARCHAR NOT NULL,
    "openingBalance" DECIMAL(15,2) DEFAULT 0,
    "currentBalance" DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR DEFAULT 'RWF',
    custodian VARCHAR NOT NULL,
    "custodianId" VARCHAR,
    description TEXT,
    status VARCHAR DEFAULT 'active',
    "createdById" VARCHAR,
    "createdByName" VARCHAR,
    "lastModifiedById" VARCHAR,
    "lastModifiedByName" VARCHAR,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 2. Create petty_cash_transactions table
CREATE TABLE IF NOT EXISTS petty_cash_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "fundId" UUID NOT NULL,
    "fundCode" VARCHAR,
    "voucherId" VARCHAR,
    "voucherNumber" VARCHAR,
    "transactionType" VARCHAR NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    "balanceBefore" DECIMAL(15,2),
    "balanceAfter" DECIMAL(15,2),
    description TEXT,
    reference VARCHAR,
    "performedById" VARCHAR,
    "performedByName" VARCHAR,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 3. Add new columns to petty_cash_vouchers
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "fundId" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "fundName" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "lineItems" JSONB;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "expenseCategory" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "checkedByName" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "checkedBySignature" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "checkedDate" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "paidByName" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "paidBySignature" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "paidDate" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "receivedByName" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "receivedBySignature" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "receivedDate" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "supportingDocs" JSONB;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "receiptUrl" VARCHAR;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE petty_cash_vouchers ADD COLUMN IF NOT EXISTS "transactionType" VARCHAR;
`;

async function run() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        await client.query(sql);
        console.log('Migration completed successfully');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        await client.end();
    }
}
run();
