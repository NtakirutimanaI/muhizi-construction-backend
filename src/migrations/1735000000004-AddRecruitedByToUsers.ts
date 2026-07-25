import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecruitedByToUsers1735000000004 implements MigrationInterface {
    name = 'AddRecruitedByToUsers1735000000004';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "recruitedBy" character varying',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "users" DROP COLUMN IF EXISTS "recruitedBy"');
    }
}
