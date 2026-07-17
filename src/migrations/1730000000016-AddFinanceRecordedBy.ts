import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFinanceRecordedBy1730000000016 implements MigrationInterface {
    name = 'AddFinanceRecordedBy1730000000016';

    private async addColumnIfMissing(queryRunner: QueryRunner, table: string, column: string): Promise<void> {
        const existing = await queryRunner.query(`
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_name = $1 AND column_name = $2
        `, [table, column]);
        if (parseInt(existing[0]?.count || '0') === 0) {
            await queryRunner.query(`ALTER TABLE "${table}" ADD COLUMN "${column}" varchar NULL`);
        }
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await this.addColumnIfMissing(queryRunner, 'incomes', 'recordedById');
        await this.addColumnIfMissing(queryRunner, 'incomes', 'recordedByName');
        await this.addColumnIfMissing(queryRunner, 'expenses', 'recordedById');
        await this.addColumnIfMissing(queryRunner, 'expenses', 'recordedByName');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const table of ['incomes', 'expenses']) {
            await queryRunner.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "recordedById"`);
            await queryRunner.query(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "recordedByName"`);
        }
    }
}
