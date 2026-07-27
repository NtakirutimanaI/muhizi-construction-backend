import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSignatureAndStampFields1730000000035 implements MigrationInterface {
    name = 'AddSignatureAndStampFields1730000000035';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ADD COLUMN "digitalSignature" text`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD COLUMN "stampUrl" text`);
        await queryRunner.query(`ALTER TABLE "money_requisitions" ADD COLUMN "stampUrl" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "money_requisitions" DROP COLUMN "stampUrl"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "stampUrl"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "digitalSignature"`);
    }
}
