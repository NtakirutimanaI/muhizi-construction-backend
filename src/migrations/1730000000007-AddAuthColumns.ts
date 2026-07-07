import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthColumns1730000000007 implements MigrationInterface {
    name = 'AddAuthColumns1730000000007';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Make password column nullable (for Google OAuth users)
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);

        // Add OTP columns for password reset
        await queryRunner.query(`ALTER TABLE "users" ADD "otpCode" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpExpiresAt" TIMESTAMP`);

        // Add googleId for Google OAuth
        await queryRunner.query(`ALTER TABLE "users" ADD "googleId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "googleId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpCode"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    }
}
