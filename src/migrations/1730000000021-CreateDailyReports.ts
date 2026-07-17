import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDailyReports1730000000021 implements MigrationInterface {
    name = 'CreateDailyReports1730000000021';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "daily_reports" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "date" date NOT NULL,
                "summary" text NOT NULL,
                "submittedById" character varying NOT NULL,
                "submittedByName" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_daily_reports_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_daily_reports_date" ON "daily_reports" ("date")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_daily_reports_submitted_by" ON "daily_reports" ("submittedById")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "daily_reports"`);
    }
}
