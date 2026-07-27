import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttendanceUniqueConstraint1736000000000 implements MigrationInterface {
    name = 'AddAttendanceUniqueConstraint1736000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint
                    WHERE conname = 'UQ_ATTENDANCE_EMPLOYEE_DATE'
                ) THEN
                    ALTER TABLE "attendance"
                    ADD CONSTRAINT "UQ_ATTENDANCE_EMPLOYEE_DATE" UNIQUE ("employeeId", "date");
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT IF EXISTS "UQ_ATTENDANCE_EMPLOYEE_DATE"`);
    }
}
