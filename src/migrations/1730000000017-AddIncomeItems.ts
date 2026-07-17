import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIncomeItems1730000000017 implements MigrationInterface {
    name = 'AddIncomeItems1730000000017';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const existing = await queryRunner.query(`
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_name = 'incomes' AND column_name = 'items'
        `);
        if (parseInt(existing[0]?.count || '0') === 0) {
            await queryRunner.query(`ALTER TABLE "incomes" ADD COLUMN "items" json NULL`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incomes" DROP COLUMN IF EXISTS "items"`);
    }
}
