import { MigrationInterface, QueryRunner } from 'typeorm';

export class FinalizeDataTypesAndConstraints1730000000004 implements MigrationInterface {
    name = 'FinalizeDataTypesAndConstraints1730000000004';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── Fix 3 varchar columns to uuid (data is already UUID text) ──
        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "userId" TYPE uuid USING "userId"::uuid`);
        await queryRunner.query(`ALTER TABLE "material_requests" ALTER COLUMN "createdById" TYPE uuid USING "createdById"::uuid`);
        await queryRunner.query(`ALTER TABLE "material_requests" ALTER COLUMN "approvedById" TYPE uuid USING "approvedById"::uuid`);

        // ── Integer range constraints ──
        await queryRunner.query(`ALTER TABLE "payroll_records" ADD CONSTRAINT "chk_payroll_month" CHECK ("month" >= 1 AND "month" <= 12)`);
        await queryRunner.query(`ALTER TABLE "construction_projects" ADD CONSTRAINT "chk_project_progress" CHECK ("progress" >= 0 AND "progress" <= 100)`);
        await queryRunner.query(`ALTER TABLE "sites" ADD CONSTRAINT "chk_site_progress" CHECK ("progress" >= 0 AND "progress" <= 100)`);
        await queryRunner.query(`ALTER TABLE "subscribers" ADD CONSTRAINT "chk_subscriber_mlscore" CHECK ("mlScore" >= 0 AND "mlScore" <= 100)`);
        await queryRunner.query(`ALTER TABLE "site_activities" ADD CONSTRAINT "chk_activity_workers" CHECK ("workers" >= 0)`);

        // ── Monetary amount constraints (must be non-negative) ──
        await queryRunner.query(`ALTER TABLE "expenses" ADD CONSTRAINT "chk_expense_amount" CHECK ("amount" > 0)`);
        await queryRunner.query(`ALTER TABLE "incomes" ADD CONSTRAINT "chk_income_amount" CHECK ("amount" > 0)`);
        await queryRunner.query(`ALTER TABLE "payroll_records" ADD CONSTRAINT "chk_payroll_basic_salary" CHECK ("basicSalary" >= 0)`);
        await queryRunner.query(`ALTER TABLE "payroll_records" ADD CONSTRAINT "chk_payroll_net_salary" CHECK ("netSalary" >= 0)`);
        await queryRunner.query(`ALTER TABLE "payroll_records" ADD CONSTRAINT "chk_payroll_allowances" CHECK ("totalAllowances" >= 0)`);
        await queryRunner.query(`ALTER TABLE "payroll_records" ADD CONSTRAINT "chk_payroll_deductions" CHECK ("totalDeductions" >= 0)`);
        await queryRunner.query(`ALTER TABLE "material_requests" ADD CONSTRAINT "chk_material_quantity" CHECK ("quantity" > 0)`);
        await queryRunner.query(`ALTER TABLE "material_requests" ADD CONSTRAINT "chk_material_unit_price" CHECK ("unitPrice" >= 0)`);
        await queryRunner.query(`ALTER TABLE "material_requests" ADD CONSTRAINT "chk_material_total_cost" CHECK ("totalCost" >= 0)`);
        await queryRunner.query(`ALTER TABLE "salary_rates" ADD CONSTRAINT "chk_salary_rate_base" CHECK ("baseSalary" >= 0)`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "chk_stock_quantity" CHECK ("quantity" >= 0)`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "chk_stock_unit_price" CHECK ("unitPrice" >= 0)`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "chk_stock_total_cost" CHECK ("totalCost" >= 0)`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "chk_employee_salary" CHECK ("salary" >= 0)`);
        await queryRunner.query(`ALTER TABLE "client_reports" ADD CONSTRAINT "chk_report_progress" CHECK ("progressPercentage" >= 0 AND "progressPercentage" <= 100)`);

        // ── Budget/spent constraints ──
        await queryRunner.query(`ALTER TABLE "construction_projects" ADD CONSTRAINT "chk_project_budget" CHECK ("budget" IS NULL OR "budget" >= 0)`);
        await queryRunner.query(`ALTER TABLE "construction_projects" ADD CONSTRAINT "chk_project_spent" CHECK ("spent" IS NULL OR "spent" >= 0)`);
        await queryRunner.query(`ALTER TABLE "sites" ADD CONSTRAINT "chk_site_budget" CHECK ("budget" IS NULL OR "budget" >= 0)`);
        await queryRunner.query(`ALTER TABLE "sites" ADD CONSTRAINT "chk_site_spent" CHECK ("spent" IS NULL OR "spent" >= 0)`);

        // ── Stock type constraint ──
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "chk_stock_type" CHECK ("type" IN ('in', 'out'))`);

        // ── Date range sanity (end >= start, both present) ──
        await queryRunner.query(`ALTER TABLE "construction_projects" ADD CONSTRAINT "chk_project_dates" CHECK ("endDate" IS NULL OR "startDate" IS NULL OR "endDate" >= "startDate")`);
        await queryRunner.query(`ALTER TABLE "sites" ADD CONSTRAINT "chk_site_dates" CHECK ("endDate" IS NULL OR "startDate" IS NULL OR "endDate" >= "startDate")`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "chk_contract_dates" CHECK ("endDate" IS NULL OR "startDate" IS NULL OR "endDate" >= "startDate")`);
        await queryRunner.query(`ALTER TABLE "partnerships" ADD CONSTRAINT "chk_partnership_dates" CHECK ("endDate" IS NULL OR "startDate" IS NULL OR "endDate" >= "startDate")`);
        await queryRunner.query(`ALTER TABLE "salary_rates" ADD CONSTRAINT "chk_salary_effective_dates" CHECK ("effectiveTo" IS NULL OR "effectiveFrom" IS NULL OR "effectiveTo" >= "effectiveFrom")`);
        await queryRunner.query(`ALTER TABLE "employee_assignments" ADD CONSTRAINT "chk_assignment_dates" CHECK ("endDate" IS NULL OR "startDate" IS NULL OR "endDate" >= "startDate")`);

        // ── Phone format constraint (NOT VALID to avoid rejecting existing data) ──
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "chk_user_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+250 7[0-9]{2} [0-9]{3} [0-9]{3}$') NOT VALID`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "chk_employee_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+250 7[0-9]{2} [0-9]{3} [0-9]{3}$') NOT VALID`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "chk_profile_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+250 7[0-9]{2} [0-9]{3} [0-9]{3}$') NOT VALID`);
        await queryRunner.query(`ALTER TABLE "partnerships" ADD CONSTRAINT "chk_partnership_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+250 7[0-9]{2} [0-9]{3} [0-9]{3}$') NOT VALID`);
        await queryRunner.query(`ALTER TABLE "contact_messages" ADD CONSTRAINT "chk_contact_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+250 7[0-9]{2} [0-9]{3} [0-9]{3}$') NOT VALID`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "userId" TYPE character varying USING "userId"::varchar`);
        await queryRunner.query(`ALTER TABLE "material_requests" ALTER COLUMN "createdById" TYPE character varying USING "createdById"::varchar`);
        await queryRunner.query(`ALTER TABLE "material_requests" ALTER COLUMN "approvedById" TYPE character varying USING "approvedById"::varchar`);

        await queryRunner.query(`ALTER TABLE "payroll_records" DROP CONSTRAINT IF EXISTS "chk_payroll_month"`);
        await queryRunner.query(`ALTER TABLE "construction_projects" DROP CONSTRAINT IF EXISTS "chk_project_progress"`);
        await queryRunner.query(`ALTER TABLE "sites" DROP CONSTRAINT IF EXISTS "chk_site_progress"`);
        await queryRunner.query(`ALTER TABLE "subscribers" DROP CONSTRAINT IF EXISTS "chk_subscriber_mlscore"`);
        await queryRunner.query(`ALTER TABLE "site_activities" DROP CONSTRAINT IF EXISTS "chk_activity_workers"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT IF EXISTS "chk_expense_amount"`);
        await queryRunner.query(`ALTER TABLE "incomes" DROP CONSTRAINT IF EXISTS "chk_income_amount"`);
        await queryRunner.query(`ALTER TABLE "payroll_records" DROP CONSTRAINT IF EXISTS "chk_payroll_basic_salary"`);
        await queryRunner.query(`ALTER TABLE "payroll_records" DROP CONSTRAINT IF EXISTS "chk_payroll_net_salary"`);
        await queryRunner.query(`ALTER TABLE "payroll_records" DROP CONSTRAINT IF EXISTS "chk_payroll_allowances"`);
        await queryRunner.query(`ALTER TABLE "payroll_records" DROP CONSTRAINT IF EXISTS "chk_payroll_deductions"`);
        await queryRunner.query(`ALTER TABLE "material_requests" DROP CONSTRAINT IF EXISTS "chk_material_quantity"`);
        await queryRunner.query(`ALTER TABLE "material_requests" DROP CONSTRAINT IF EXISTS "chk_material_unit_price"`);
        await queryRunner.query(`ALTER TABLE "material_requests" DROP CONSTRAINT IF EXISTS "chk_material_total_cost"`);
        await queryRunner.query(`ALTER TABLE "salary_rates" DROP CONSTRAINT IF EXISTS "chk_salary_rate_base"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT IF EXISTS "chk_stock_quantity"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT IF EXISTS "chk_stock_unit_price"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT IF EXISTS "chk_stock_total_cost"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT IF EXISTS "chk_employee_salary"`);
        await queryRunner.query(`ALTER TABLE "client_reports" DROP CONSTRAINT IF EXISTS "chk_report_progress"`);
        await queryRunner.query(`ALTER TABLE "construction_projects" DROP CONSTRAINT IF EXISTS "chk_project_budget"`);
        await queryRunner.query(`ALTER TABLE "construction_projects" DROP CONSTRAINT IF EXISTS "chk_project_spent"`);
        await queryRunner.query(`ALTER TABLE "sites" DROP CONSTRAINT IF EXISTS "chk_site_budget"`);
        await queryRunner.query(`ALTER TABLE "sites" DROP CONSTRAINT IF EXISTS "chk_site_spent"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT IF EXISTS "chk_stock_type"`);
        await queryRunner.query(`ALTER TABLE "construction_projects" DROP CONSTRAINT IF EXISTS "chk_project_dates"`);
        await queryRunner.query(`ALTER TABLE "sites" DROP CONSTRAINT IF EXISTS "chk_site_dates"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT IF EXISTS "chk_contract_dates"`);
        await queryRunner.query(`ALTER TABLE "partnerships" DROP CONSTRAINT IF EXISTS "chk_partnership_dates"`);
        await queryRunner.query(`ALTER TABLE "salary_rates" DROP CONSTRAINT IF EXISTS "chk_salary_effective_dates"`);
        await queryRunner.query(`ALTER TABLE "employee_assignments" DROP CONSTRAINT IF EXISTS "chk_assignment_dates"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "chk_user_phone"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT IF EXISTS "chk_employee_phone"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "chk_profile_phone"`);
        await queryRunner.query(`ALTER TABLE "partnerships" DROP CONSTRAINT IF EXISTS "chk_partnership_phone"`);
        await queryRunner.query(`ALTER TABLE "contact_messages" DROP CONSTRAINT IF EXISTS "chk_contact_phone"`);
    }
}
