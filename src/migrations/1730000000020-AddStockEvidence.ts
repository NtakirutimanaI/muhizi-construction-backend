import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStockEvidence1730000000020 implements MigrationInterface {
    name = 'AddStockEvidence1730000000020';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "evidenceUrls" json NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN IF EXISTS "evidenceUrls"`);
    }
}
