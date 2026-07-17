import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractEmployeeLink1730000000015 implements MigrationInterface {
    name = 'AddContractEmployeeLink1730000000015';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasColumn = await queryRunner.query(`
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_name = 'contracts' AND column_name = 'employeeId'
        `);
        if (parseInt(hasColumn[0]?.count || '0') === 0) {
            await queryRunner.query(`ALTER TABLE "contracts" ADD COLUMN "employeeId" uuid NULL`);
        }

        const hasIndex = await queryRunner.query(`
            SELECT COUNT(*) FROM pg_indexes WHERE indexname = 'idx_contract_employee'
        `);
        if (parseInt(hasIndex[0]?.count || '0') === 0) {
            await queryRunner.query(`CREATE INDEX "idx_contract_employee" ON "contracts" ("employeeId")`);
        }

        const hasConstraint = await queryRunner.query(`
            SELECT COUNT(*) FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'contracts' AND c.conname = 'FK_contracts_employeeId'
        `);
        if (parseInt(hasConstraint[0]?.count || '0') === 0) {
            await queryRunner.query(`
                ALTER TABLE "contracts"
                ADD CONSTRAINT "FK_contracts_employeeId"
                FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT IF EXISTS "FK_contracts_employeeId"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_contract_employee"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN IF EXISTS "employeeId"`);
    }
}
