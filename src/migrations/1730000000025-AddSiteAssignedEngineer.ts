import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSiteAssignedEngineer1730000000025 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS "assignedEngineerId" uuid`);
        await queryRunner.query(`ALTER TABLE "sites" ADD COLUMN IF NOT EXISTS "assignedEngineerName" character varying`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_site_assigned_engineer" ON "sites" ("assignedEngineerId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_site_assigned_engineer"`);
        await queryRunner.query(`ALTER TABLE "sites" DROP COLUMN IF EXISTS "assignedEngineerName"`);
        await queryRunner.query(`ALTER TABLE "sites" DROP COLUMN IF EXISTS "assignedEngineerId"`);
    }
}
