import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasks1730000000029 implements MigrationInterface {
    name = 'CreateTasks1730000000029';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "task_priority_enum" AS ENUM ('low', 'medium', 'high')
        `);
        await queryRunner.query(`
            CREATE TYPE "task_status_enum" AS ENUM ('pending', 'in_progress', 'completed', 'rejected')
        `);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "priority" "task_priority_enum" NOT NULL DEFAULT 'medium',
                "status" "task_status_enum" NOT NULL DEFAULT 'pending',
                "assignedTo" character varying NOT NULL,
                "assignedToName" character varying NOT NULL,
                "assignedBy" character varying NOT NULL,
                "assignedByName" character varying NOT NULL,
                "dueDate" character varying,
                "notes" text,
                "completionNotes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_task_priority" ON "tasks" ("priority")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_task_status" ON "tasks" ("status")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_task_created" ON "tasks" ("createdAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_task_created"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_task_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_task_priority"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "task_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "task_priority_enum"`);
    }
}
