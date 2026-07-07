import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelaxPhoneCheckConstraints1730000000006 implements MigrationInterface {
    name = 'RelaxPhoneCheckConstraints1730000000006';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "chk_user_phone"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT IF EXISTS "chk_employee_phone"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "chk_profile_phone"`);
        await queryRunner.query(`ALTER TABLE "partnerships" DROP CONSTRAINT IF EXISTS "chk_partnership_phone"`);
        await queryRunner.query(`ALTER TABLE "contact_messages" DROP CONSTRAINT IF EXISTS "chk_contact_phone"`);

        // Accepts: +<country_code><number> with optional spaces, dashes, dots, parens
        // Minimum: +<1 digit><1 digit> = 3+ chars. Must start with +, end with digit.
        // Only digits, spaces, dashes, dots, parens allowed in between.
        // Examples: +250788123456, +1 555-123-4567, +44 20 7123 4567, +33 1 23 45 67 89
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "chk_user_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+\\d[- .()0-9]+\\d$') NOT VALID`
        );
        await queryRunner.query(
            `ALTER TABLE "employees" ADD CONSTRAINT "chk_employee_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+\\d[- .()0-9]+\\d$') NOT VALID`
        );
        await queryRunner.query(
            `ALTER TABLE "profiles" ADD CONSTRAINT "chk_profile_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+\\d[- .()0-9]+\\d$') NOT VALID`
        );
        await queryRunner.query(
            `ALTER TABLE "partnerships" ADD CONSTRAINT "chk_partnership_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+\\d[- .()0-9]+\\d$') NOT VALID`
        );
        await queryRunner.query(
            `ALTER TABLE "contact_messages" ADD CONSTRAINT "chk_contact_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+\\d[- .()0-9]+\\d$') NOT VALID`
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
