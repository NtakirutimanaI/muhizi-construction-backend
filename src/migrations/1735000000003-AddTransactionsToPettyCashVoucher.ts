import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransactionsToPettyCashVoucher1735000000003 implements MigrationInterface {
    name = 'AddTransactionsToPettyCashVoucher1735000000003';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "petty_cash_vouchers" ADD COLUMN "transactions" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "petty_cash_vouchers" DROP COLUMN "transactions"`);
    }
}
