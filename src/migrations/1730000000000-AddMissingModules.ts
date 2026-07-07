import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingModules1730000000000 implements MigrationInterface {
    name = 'AddMissingModules1730000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── 1. system_settings ──────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "system_settings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "key" character varying NOT NULL,
                "value" text NOT NULL,
                "category" character varying NOT NULL DEFAULT 'general',
                "description" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_system_settings" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_system_settings_key" UNIQUE ("key")
            )
        `);

        // ── 2. salary_rates ────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "salary_rates" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "employeeId" uuid,
                "role" character varying,
                "baseSalary" decimal(12,2) NOT NULL,
                "contractType" character varying NOT NULL DEFAULT 'contracted',
                "effectiveFrom" date NOT NULL,
                "effectiveTo" date,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_salary_rates" PRIMARY KEY ("id")
            )
        `);

        // ── 3. client_reports ─────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "client_reports" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "projectId" uuid NOT NULL,
                "title" character varying NOT NULL,
                "description" text,
                "progressPercentage" decimal(5,2) DEFAULT 0,
                "status" character varying NOT NULL DEFAULT 'draft',
                "createdById" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_client_reports" PRIMARY KEY ("id")
            )
        `);

        // ── 4. design_reviews ─────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "design_reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "designId" uuid NOT NULL,
                "reviewerId" uuid NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "comments" text,
                "submittedAt" TIMESTAMP DEFAULT now(),
                "reviewedAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_design_reviews" PRIMARY KEY ("id")
            )
        `);

        // ── 5. stock_approvals ────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "stock_approvals" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "stockId" uuid NOT NULL,
                "approvedById" uuid NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "comments" text,
                "type" character varying NOT NULL DEFAULT 'co_sign',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_stock_approvals" PRIMARY KEY ("id")
            )
        `);

        // ── Foreign Keys ──────────────────────────────────────────────
        await queryRunner.query(`
            ALTER TABLE "salary_rates"
            ADD CONSTRAINT "FK_salary_rates_employee"
            FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "client_reports"
            ADD CONSTRAINT "FK_client_reports_project"
            FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "client_reports"
            ADD CONSTRAINT "FK_client_reports_creator"
            FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "design_reviews"
            ADD CONSTRAINT "FK_design_reviews_design"
            FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "design_reviews"
            ADD CONSTRAINT "FK_design_reviews_reviewer"
            FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "stock_approvals"
            ADD CONSTRAINT "FK_stock_approvals_stock"
            FOREIGN KEY ("stockId") REFERENCES "stock"("id") ON DELETE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "stock_approvals"
            ADD CONSTRAINT "FK_stock_approvals_approver"
            FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "stock_approvals" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "design_reviews" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "client_reports" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "salary_rates" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "system_settings" CASCADE`);
    }
}
