import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserInsuranceContractBankColumns1730000000025 implements MigrationInterface {
    name = 'AddUserInsuranceContractBankColumns1730000000025';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "medicalInsurance" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "contractUrl" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bankAccount" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bankAccount"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "contractUrl"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "medicalInsurance"`);
    }
}
