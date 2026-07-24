import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClientReportMedia1730000000026 implements MigrationInterface {
    name = 'AddClientReportMedia1730000000026';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_reports" ADD COLUMN IF NOT EXISTS "media" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_reports" DROP COLUMN IF EXISTS "media"`);
    }
}
