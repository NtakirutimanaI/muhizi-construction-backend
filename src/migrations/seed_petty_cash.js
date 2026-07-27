const { Client } = require('pg');
require('dotenv').config();

async function seed() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        // 1. Create a petty cash fund first
        const fundRes = await client.query(`
            INSERT INTO petty_cash_funds ("fundCode", "fundName", "openingBalance", "currentBalance", currency, custodian, status, description)
            VALUES ('PCF-2026-0001', 'Main Office Petty Cash', 100000, 91100, 'RWF', 'MUTIMUKEYE Odette', 'active', 'General office petty cash fund for daily expenses')
            ON CONFLICT ("fundCode") DO NOTHING
            RETURNING id
        `);
        const fundId = fundRes.rows[0]?.id;
        if (!fundId) {
            const existing = await client.query(`SELECT id FROM petty_cash_funds WHERE "fundCode" = 'PCF-2026-0001'`);
            var fundIdVal = existing.rows[0]?.id;
        } else {
            var fundIdVal = fundId;
        }
        console.log('Fund ID:', fundIdVal);

        // 2. Create the main voucher with your data
        const voucherRes = await client.query(`
            INSERT INTO petty_cash_vouchers (
                "voucherNumber", date, reference, status,
                "payeeName", department, position,
                amount, currency, "paymentPurpose", description, "fundId", "fundName",
                "lineItems", "expenseCategory", notes, "transactionType",
                "requestedByName", "requestedDate",
                "approvedByName", "approvedDate",
                "createdByName"
            )             VALUES (
                'PCV-2026-0100', '2026-06-26', 'PCV-JUN-2026-001', 'approved',
                'Office Supplies Vendor', 'Administration', 'Supplier',
                58600, 'RWF', 'Monthly petty cash expenses - June 2026',
                'Petty cash voucher for June 2026 expenses including hygiene products, meals, and drinking water',
                $1, 'Main Office Petty Cash',
                '[
                    {"id": "li001", "description": "Papier hygiénique", "expenseCategory": "Cleaning & Hygiene", "debit": 400, "credit": 0, "quantity": 1, "unitCost": 400},
                    {"id": "li002", "description": "Lunch", "expenseCategory": "Meals", "debit": 6000, "credit": 0, "quantity": 1, "unitCost": 6000},
                    {"id": "li003", "description": "Drinking water", "expenseCategory": "Office Supplies", "debit": 2500, "credit": 0, "quantity": 1, "unitCost": 2500}
                ]'::jsonb,
                'Office Supplies',
                'Expenses for the week: hygiene supplies, staff lunch, and drinking water for the office.',
                'cash_issued',
                'MUTIMUKEYE Odette', '2026-06-26',
                'UWIMANA Papias', '2026-06-26',
                'MUTIMUKEYE Odette'
            ) RETURNING id, "voucherNumber"
        `, [fundIdVal]);
        console.log('Voucher created:', voucherRes.rows[0]);

        // 3. Create a second voucher for variety (July)
        const voucherRes2 = await client.query(`
            INSERT INTO petty_cash_vouchers (
                "voucherNumber", date, reference, status,
                "payeeName", department,
                amount, currency, "paymentPurpose", description, "fundId", "fundName",
                "lineItems", "expenseCategory", notes, "transactionType",
                "requestedByName", "requestedDate",
                "createdByName"
            ) VALUES (
                'PCV-2026-0101', '2026-07-01', 'PCV-JUL-2026-001', 'draft',
                'Site Operations', 'Construction',
                15000, 'RWF', 'Site transport and materials',
                'Transport costs and small materials for site visit',
                $1, 'Main Office Petty Cash',
                '[
                    {"id": "li004", "description": "Transport to site", "expenseCategory": "Transportation", "debit": 5000, "credit": 0, "quantity": 2, "unitCost": 2500},
                    {"id": "li005", "description": "Drinking water (site)", "expenseCategory": "Office Supplies", "debit": 1500, "credit": 0, "quantity": 3, "unitCost": 500},
                    {"id": "li006", "description": "Fuel for vehicle", "expenseCategory": "Fuel", "debit": 8500, "credit": 0, "quantity": 1, "unitCost": 8500}
                ]'::jsonb,
                'Transportation',
                'Site visit expenses for July 1, 2026',
                'cash_issued',
                'MUTIMUKEYE Odette', '2026-07-01',
                'MUTIMUKEYE Odette'
            ) RETURNING id, "voucherNumber"
        `, [fundIdVal]);
        console.log('Voucher 2 created:', voucherRes2.rows[0]);

        // 4. Create transaction records
        if (fundIdVal) {
            await client.query(`
                INSERT INTO petty_cash_transactions ("fundId", "fundCode", "voucherId", "voucherNumber", "transactionType", amount, "balanceBefore", "balanceAfter", description, "performedByName")
                VALUES
                ($1, 'PCF-2026-0001', $2, 'PCV-2026-0100', 'voucher_payment', 58600, 100000, 41400, 'Petty cash issued for June 2026 expenses', 'MUTIMUKEYE Odette'),
                ($1, 'PCF-2026-0001', $3, 'PCV-2026-0101', 'voucher_payment', 15000, 41400, 26400, 'Petty cash issued for July site expenses', 'MUTIMUKEYE Odette')
            `, [fundIdVal, voucherRes.rows[0]?.id, voucherRes2.rows[0]?.id]);
            console.log('Transactions created');
        }

        console.log('\nSeed completed successfully!');
    } catch (err) {
        console.error('Seed failed:', err.message);
    } finally {
        await client.end();
    }
}

seed();
