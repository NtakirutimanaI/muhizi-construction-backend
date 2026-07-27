import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractSalaryFields1730000000026 implements MigrationInterface {
    name = 'AddContractSalaryFields1730000000026';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" ADD "basicSalary" decimal(12,2) DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "netSalary" decimal(12,2) DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "paymentFrequency" character varying`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "workingConditions" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "workingConditions"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "paymentFrequency"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "netSalary"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "basicSalary"`);
    }
}
