import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpenseItems1730000000018 implements MigrationInterface {
    name = 'AddExpenseItems1730000000018';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const existing = await queryRunner.query(`
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_name = 'expenses' AND column_name = 'items'
        `);
        if (parseInt(existing[0]?.count || '0') === 0) {
            await queryRunner.query(`ALTER TABLE "expenses" ADD COLUMN "items" json NULL`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN IF EXISTS "items"`);
    }
}
