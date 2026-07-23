import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubmittedToAdmin1730000000032 implements MigrationInterface {
    name = 'AddSubmittedToAdmin1730000000032';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "engineering_submissions"
            ADD COLUMN "submittedToAdmin" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "engineering_submissions" DROP COLUMN "submittedToAdmin"`);
    }
}
