import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmploymentFields1730000000027 implements MigrationInterface {
    name = 'AddEmploymentFields1730000000027';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "employmentStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "employmentCategory" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "workShift" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "workShift"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "employmentCategory"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "employmentStatus"`);
    }
}
