import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserDetailsColumns1730000000001 implements MigrationInterface {
    name = 'AddUserDetailsColumns1730000000001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // --- users table ---
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "address" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "gender" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "maritalStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "nationalId" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "educationLevel" character varying`);

        // Copy existing profile data into users table
        await queryRunner.query(`
            UPDATE "users" u
            SET
                "firstName" = p."firstName",
                "lastName" = p."lastName",
                "address" = p."address",
                "phone" = p."phone"
            FROM "profiles" p
            WHERE p."userId" = u.id
        `);

        // --- employees table ---
        await queryRunner.query(`ALTER TABLE "employees" ADD "gender" character varying`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "maritalStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "nationalId" character varying`);
        await queryRunner.query(`ALTER TABLE "employees" ADD "educationLevel" character varying`);

        // --- profiles table ---
        await queryRunner.query(`ALTER TABLE "profiles" ADD "gender" character varying`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "maritalStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "nationalId" character varying`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "educationLevel" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // --- profiles table ---
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "educationLevel"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "nationalId"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "maritalStatus"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "gender"`);

        // --- employees table ---
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "educationLevel"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "nationalId"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "maritalStatus"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "gender"`);

        // --- users table ---
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "educationLevel"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nationalId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "maritalStatus"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
    }
}
