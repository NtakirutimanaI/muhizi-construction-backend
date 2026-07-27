import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDesignSource1730000000030 implements MigrationInterface {
    name = 'AddDesignSource1730000000030';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "designs"
            ADD COLUMN "source" varchar NOT NULL DEFAULT 'external'
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_design_source" ON "designs" ("source")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_design_source"`);
        await queryRunner.query(`ALTER TABLE "designs" DROP COLUMN "source"`);
    }
}
