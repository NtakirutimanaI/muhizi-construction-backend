import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoneyRequisitionFormFields1730000000034 implements MigrationInterface {
    name = 'AddMoneyRequisitionFormFields1730000000034';

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "money_requisitions" ADD COLUMN "department" character varying`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" ADD COLUMN "reason" character varying`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" ADD COLUMN "requestedDisbursementDate" character varying`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" ADD COLUMN "requesterSignature" character varying`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" ADD COLUMN "authorizationStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" ADD COLUMN "authorizedByName" character varying`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" ADD COLUMN "authorizedByPosition" character varying`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" ADD COLUMN "authorizedBySignature" character varying`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" ADD COLUMN "authorizationDate" character varying`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "money_requisitions" DROP COLUMN "department"`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" DROP COLUMN "reason"`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" DROP COLUMN "requestedDisbursementDate"`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" DROP COLUMN "requesterSignature"`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" DROP COLUMN "authorizationStatus"`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" DROP COLUMN "authorizedByName"`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" DROP COLUMN "authorizedByPosition"`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" DROP COLUMN "authorizedBySignature"`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" DROP COLUMN "authorizationDate"`);
    }
}
