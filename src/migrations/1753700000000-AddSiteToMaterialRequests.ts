import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSiteToMaterialRequests1753700000000 implements MigrationInterface {
    name = 'AddSiteToMaterialRequests1753700000000';

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material_requests" ADD COLUMN "site" character varying`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material_requests" DROP COLUMN "site"`);
    }
}
