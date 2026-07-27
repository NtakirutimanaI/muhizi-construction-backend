import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDesignSavedBy1730000000031 implements MigrationInterface {
    name = 'AddDesignSavedBy1730000000031';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "designs"
            ADD COLUMN "savedBy" varchar
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_design_saved_by" ON "designs" ("savedBy")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_design_saved_by"`);
        await queryRunner.query(`ALTER TABLE "designs" DROP COLUMN "savedBy"`);
    }
}
