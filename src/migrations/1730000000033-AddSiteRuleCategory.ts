import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSiteRuleCategory1730000000033 implements MigrationInterface {
    name = 'AddSiteRuleCategory1730000000033';

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site_rules" ADD COLUMN "category" character varying`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site_rules" DROP COLUMN "category"`);
    }
}
