import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttendanceSubmittedByConstraint1736000000001 implements MigrationInterface {
    name = 'AddAttendanceSubmittedByConstraint1736000000001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendance" ADD COLUMN IF NOT EXISTS "submittedById" uuid`);
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint
                    WHERE conname = 'UQ_ATTENDANCE_SUBMITTED_BY_DATE'
                ) THEN
                    ALTER TABLE "attendance"
                    ADD CONSTRAINT "UQ_ATTENDANCE_SUBMITTED_BY_DATE" UNIQUE ("submittedById", "date");
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT IF EXISTS "UQ_ATTENDANCE_SUBMITTED_BY_DATE"`);
        await queryRunner.query(`ALTER TABLE "attendance" DROP COLUMN IF EXISTS "submittedById"`);
    }
}
