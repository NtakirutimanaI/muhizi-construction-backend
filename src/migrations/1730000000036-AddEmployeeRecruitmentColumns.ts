import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmployeeRecruitmentColumns1730000000036 implements MigrationInterface {
    name = 'AddEmployeeRecruitmentColumns1730000000036';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "workShift" character varying`);
        await queryRunner.query(`ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "employmentStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "recruitedBy" character varying`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_employee_recruited_by" ON "employees" ("recruitedBy")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_employee_recruited_by"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "recruitedBy"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "employmentStatus"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "workShift"`);
    }
}
