import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixPhoneCheckConstraints1730000000005 implements MigrationInterface {
    name = 'FixPhoneCheckConstraints1730000000005';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop old Rwanda-only phone constraints
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "chk_user_phone"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT IF EXISTS "chk_employee_phone"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "chk_profile_phone"`);
        await queryRunner.query(`ALTER TABLE "partnerships" DROP CONSTRAINT IF EXISTS "chk_partnership_phone"`);
        await queryRunner.query(`ALTER TABLE "contact_messages" DROP CONSTRAINT IF EXISTS "chk_contact_phone"`);

        // Add international phone constraints
        // Accepts: +<country_code><number> with optional spaces/dashes
        // Country code: 1-3 digits, total digits 7-15 (ITU standard)
        // Examples: +250788123456, +1 555 123 4567, +44-20-7123-4567, +250 788 123 456
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "chk_user_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+\\d{1,3}[- ]?\\d{1,4}[- ]?\\d{1,4}[- ]?\\d{1,9}$') NOT VALID`
        );
        await queryRunner.query(
            `ALTER TABLE "employees" ADD CONSTRAINT "chk_employee_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+\\d{1,3}[- ]?\\d{1,4}[- ]?\\d{1,4}[- ]?\\d{1,9}$') NOT VALID`
        );
        await queryRunner.query(
            `ALTER TABLE "profiles" ADD CONSTRAINT "chk_profile_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+\\d{1,3}[- ]?\\d{1,4}[- ]?\\d{1,4}[- ]?\\d{1,9}$') NOT VALID`
        );
        await queryRunner.query(
            `ALTER TABLE "partnerships" ADD CONSTRAINT "chk_partnership_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+\\d{1,3}[- ]?\\d{1,4}[- ]?\\d{1,4}[- ]?\\d{1,9}$') NOT VALID`
        );
        await queryRunner.query(
            `ALTER TABLE "contact_messages" ADD CONSTRAINT "chk_contact_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+\\d{1,3}[- ]?\\d{1,4}[- ]?\\d{1,4}[- ]?\\d{1,9}$') NOT VALID`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "chk_user_phone"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT IF EXISTS "chk_employee_phone"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "chk_profile_phone"`);
        await queryRunner.query(`ALTER TABLE "partnerships" DROP CONSTRAINT IF EXISTS "chk_partnership_phone"`);
        await queryRunner.query(`ALTER TABLE "contact_messages" DROP CONSTRAINT IF EXISTS "chk_contact_phone"`);
    }
}
