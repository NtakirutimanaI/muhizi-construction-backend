import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneUniqueConstraint1730000000008 implements MigrationInterface {
    name = 'AddPhoneUniqueConstraint1730000000008';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasIndex = await queryRunner.query(`
            SELECT COUNT(*) FROM pg_indexes
            WHERE indexname = 'idx_profiles_phone_unique'
        `);
        if (parseInt(hasIndex[0]?.count || '0') === 0) {
            await queryRunner.query(`
                CREATE UNIQUE INDEX "idx_profiles_phone_unique"
                ON "profiles" ("phone")
                WHERE "phone" IS NOT NULL
            `);
        }

        const hasConstraint = await queryRunner.query(`
            SELECT COUNT(*) FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'profiles'
            AND c.conname = 'UQ_profiles_phone'
        `);
        if (parseInt(hasConstraint[0]?.count || '0') === 0) {
            await queryRunner.query(`
                ALTER TABLE "profiles"
                ADD CONSTRAINT "UQ_profiles_phone" UNIQUE ("phone")
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX IF EXISTS "idx_profiles_phone_unique"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "UQ_profiles_phone"
        `);
    }
}
