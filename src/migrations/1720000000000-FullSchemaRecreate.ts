import { MigrationInterface, QueryRunner } from 'typeorm';

export class FullSchemaRecreate1720000000000 implements MigrationInterface {
    name = 'FullSchemaRecreate1720000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ──────────────────────────────────────────────────────────────────
        // 1. DROP existing tables (child-first to respect FK constraints)
        // ──────────────────────────────────────────────────────────────────
        await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_messages" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_conversations" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "contact_messages" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "file_uploads" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "page_sections" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "partnerships" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "permissions" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "visitors" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "subscribers" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "resources" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "project_evidence" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "material_requests" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "employee_assignments" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "site_activities" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "site_rules" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "attendance" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "payroll_records" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "designs" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "contracts" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "approvals" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "expenses" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "incomes" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "stock" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "categories" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "employees" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "sites" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "construction_projects" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "profiles" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);

        // Drop dependent enum types
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."projects_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."projects_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."sites_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."employees_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."employees_department_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."income_category_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."expense_category_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."payroll_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."attendance_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."design_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."design_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."partnership_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."partnership_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."resource_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."assignment_role_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."chat_sender_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."message_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."notification_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."notification_status_enum"`);

        // ──────────────────────────────────────────────────────────────────
        // 2. CREATE ENUM TYPES
        // ──────────────────────────────────────────────────────────────────
        await queryRunner.query(`CREATE TYPE "public"."employees_status_enum" AS ENUM('active', 'inactive', 'terminated')`);
        await queryRunner.query(`CREATE TYPE "public"."employees_department_enum" AS ENUM('admin', 'construction', 'design', 'finance', 'hr', 'sales', 'engineering', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('planning', 'in_progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."sites_status_enum" AS ENUM('active', 'inactive', 'completed')`);
        await queryRunner.query(`CREATE TYPE "public"."income_category_enum" AS ENUM('project_payment', 'rental', 'investment', 'consulting', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."expense_category_enum" AS ENUM('materials', 'labor', 'equipment', 'transport', 'utilities', 'rent', 'salary', 'marketing', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."payroll_status_enum" AS ENUM('draft', 'paid', 'pending')`);
        await queryRunner.query(`CREATE TYPE "public"."attendance_status_enum" AS ENUM('present', 'absent', 'late', 'half_day', 'on_leave', 'permission', 'suspended')`);
        await queryRunner.query(`CREATE TYPE "public"."design_status_enum" AS ENUM('draft', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TYPE "public"."design_type_enum" AS ENUM('architectural', 'structural', 'interior', 'landscape')`);
        await queryRunner.query(`CREATE TYPE "public"."partnership_type_enum" AS ENUM('supplier', 'subcontractor', 'investor', 'joint_venture')`);
        await queryRunner.query(`CREATE TYPE "public"."partnership_status_enum" AS ENUM('active', 'inactive', 'pending')`);
        await queryRunner.query(`CREATE TYPE "public"."resource_type_enum" AS ENUM('credential', 'link', 'note', 'event')`);
        await queryRunner.query(`CREATE TYPE "public"."assignment_role_enum" AS ENUM('manager', 'site_manager', 'worker', 'supervisor')`);
        await queryRunner.query(`CREATE TYPE "public"."chat_sender_enum" AS ENUM('user', 'bot', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."message_status_enum" AS ENUM('new', 'read', 'replied', 'archived', 'sent')`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('profile_update', 'welcome', 'password_reset', 'account_activity', 'system')`);
        await queryRunner.query(`CREATE TYPE "public"."notification_status_enum" AS ENUM('pending', 'sent', 'failed')`);

        // ──────────────────────────────────────────────────────────────────
        // 3. CREATE TABLES
        // ──────────────────────────────────────────────────────────────────

        // -- users --
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "email" VARCHAR NOT NULL,
                "username" VARCHAR NOT NULL,
                "password" VARCHAR NOT NULL,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "role" VARCHAR NOT NULL DEFAULT 'admin',
                "refreshToken" VARCHAR,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_users" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "UQ_users_username" UNIQUE ("username")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "idx_users_username" ON "users" ("username")`);
        await queryRunner.query(`CREATE INDEX "idx_users_is_active" ON "users" ("isActive")`);
        await queryRunner.query(`CREATE INDEX "idx_users_role" ON "users" ("role")`);

        // -- profiles --
        await queryRunner.query(`
            CREATE TABLE "profiles" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "firstName" VARCHAR NOT NULL,
                "lastName" VARCHAR NOT NULL,
                "avatar_content" TEXT,
                "cvUrl" TEXT,
                "companyLogo" TEXT,
                "company" VARCHAR,
                "bio" TEXT,
                "greeting" VARCHAR DEFAULT 'Hello',
                "aboutMeTitle" VARCHAR DEFAULT 'A Bit About Me',
                "phone" VARCHAR,
                "email" VARCHAR,
                "dateOfBirth" TIMESTAMP,
                "address" VARCHAR,
                "location" VARCHAR,
                "city" VARCHAR,
                "country" VARCHAR,
                "zipCode" VARCHAR,
                "title" VARCHAR,
                "type" VARCHAR,
                "role" VARCHAR,
                "yearsOfExperience" INT,
                "education" JSONB,
                "about" TEXT,
                "experience" JSONB,
                "skills" JSONB,
                "projects" JSONB,
                "certifications" JSONB,
                "languages" JSONB,
                "teamMembers" JSONB,
                "socialLinks" JSONB,
                "servicesOffered" TEXT,
                "availableForHire" BOOLEAN NOT NULL DEFAULT true,
                "isPublic" BOOLEAN NOT NULL DEFAULT true,
                "allowMessages" BOOLEAN NOT NULL DEFAULT true,
                "showViews" BOOLEAN NOT NULL DEFAULT true,
                "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
                "preferences" JSONB,
                "poweredBy" VARCHAR,
                "pageContent" JSONB,
                "userId" UUID,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_profiles" PRIMARY KEY ("id"),
                CONSTRAINT "REL_profiles_user" UNIQUE ("userId"),
                CONSTRAINT "FK_profiles_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_profiles_first_name" ON "profiles" ("firstName")`);
        await queryRunner.query(`CREATE INDEX "idx_profiles_last_name" ON "profiles" ("lastName")`);
        await queryRunner.query(`CREATE INDEX "idx_profiles_email" ON "profiles" ("email")`);
        await queryRunner.query(`CREATE INDEX "idx_profiles_is_public" ON "profiles" ("isPublic")`);
        await queryRunner.query(`CREATE INDEX "idx_profiles_maintenance" ON "profiles" ("maintenanceMode")`);

        // -- construction_projects --
        await queryRunner.query(`
            CREATE TABLE "construction_projects" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "name" VARCHAR NOT NULL,
                "description" TEXT,
                "type" VARCHAR(50) NOT NULL DEFAULT 'construction',
                "status" "public"."projects_status_enum" NOT NULL DEFAULT 'planning',
                "startDate" DATE,
                "endDate" DATE,
                "budget" DECIMAL(15,2),
                "spent" DECIMAL(15,2),
                "location" VARCHAR,
                "clientName" VARCHAR,
                "clientContact" VARCHAR,
                "progress" INT NOT NULL DEFAULT 0,
                "images" JSONB,
                "documents" JSONB,
                "milestones" JSONB,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_construction_projects" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_project_status" ON "construction_projects" ("status")`);
        await queryRunner.query(`CREATE INDEX "idx_project_created" ON "construction_projects" ("createdAt")`);

        // -- sites --
        await queryRunner.query(`
            CREATE TABLE "sites" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "name" VARCHAR NOT NULL,
                "description" TEXT,
                "location" VARCHAR,
                "status" "public"."sites_status_enum" NOT NULL DEFAULT 'active',
                "startDate" DATE,
                "endDate" DATE,
                "budget" DECIMAL(15,2),
                "spent" DECIMAL(15,2),
                "progress" INT NOT NULL DEFAULT 0,
                "images" JSONB,
                "projectId" UUID,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_sites" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_sites_name" UNIQUE ("name"),
                CONSTRAINT "FK_sites_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_site_status" ON "sites" ("status")`);
        await queryRunner.query(`CREATE INDEX "idx_site_project" ON "sites" ("projectId")`);

        // -- employees --
        await queryRunner.query(`
            CREATE TABLE "employees" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "firstName" VARCHAR NOT NULL,
                "lastName" VARCHAR NOT NULL,
                "email" VARCHAR NOT NULL,
                "phone" VARCHAR,
                "position" VARCHAR,
                "department" "public"."employees_department_enum" NOT NULL DEFAULT 'other',
                "hireDate" DATE,
                "salary" DECIMAL(12,2) NOT NULL DEFAULT 0,
                "status" "public"."employees_status_enum" NOT NULL DEFAULT 'active',
                "avatar" VARCHAR,
                "address" VARCHAR,
                "emergencyContact" VARCHAR,
                "documents" JSONB,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_employees" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_employees_email" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_employee_email" ON "employees" ("email")`);
        await queryRunner.query(`CREATE INDEX "idx_employee_department" ON "employees" ("department")`);
        await queryRunner.query(`CREATE INDEX "idx_employee_status" ON "employees" ("status")`);
        await queryRunner.query(`CREATE INDEX "idx_employee_created" ON "employees" ("createdAt")`);

        // -- categories --
        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "value" VARCHAR(100) NOT NULL,
                "label" VARCHAR(200) NOT NULL,
                "isBuiltin" BOOLEAN NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_categories" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_categories_value" UNIQUE ("value")
            )
        `);

        // -- stock --
        await queryRunner.query(`
            CREATE TABLE "stock" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "item" VARCHAR NOT NULL,
                "category" VARCHAR(100) NOT NULL DEFAULT 'other',
                "type" VARCHAR(10) NOT NULL,
                "quantity" DECIMAL(12,2) NOT NULL DEFAULT 0,
                "unit" VARCHAR NOT NULL DEFAULT 'pieces',
                "unitPrice" DECIMAL(15,2) NOT NULL DEFAULT 0,
                "totalCost" DECIMAL(15,2) NOT NULL DEFAULT 0,
                "date" DATE NOT NULL,
                "time" VARCHAR(10),
                "reference" VARCHAR,
                "notes" TEXT,
                "createdById" UUID,
                "createdByName" VARCHAR,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_stock" PRIMARY KEY ("id"),
                CONSTRAINT "FK_stock_created_by" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_stock_category" ON "stock" ("category")`);
        await queryRunner.query(`CREATE INDEX "idx_stock_type" ON "stock" ("type")`);
        await queryRunner.query(`CREATE INDEX "idx_stock_created_by" ON "stock" ("createdById")`);

        // -- incomes --
        await queryRunner.query(`
            CREATE TABLE "incomes" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "description" VARCHAR NOT NULL,
                "amount" DECIMAL(15,2) NOT NULL,
                "category" "public"."income_category_enum" NOT NULL DEFAULT 'other',
                "source" VARCHAR,
                "projectId" UUID,
                "date" DATE NOT NULL,
                "paymentMethod" VARCHAR,
                "reference" VARCHAR,
                "notes" TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_incomes" PRIMARY KEY ("id"),
                CONSTRAINT "FK_incomes_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE SET NULL
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_income_category" ON "incomes" ("category")`);
        await queryRunner.query(`CREATE INDEX "idx_income_project" ON "incomes" ("projectId")`);
        await queryRunner.query(`CREATE INDEX "idx_income_date" ON "incomes" ("date")`);

        // -- expenses --
        await queryRunner.query(`
            CREATE TABLE "expenses" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "description" VARCHAR NOT NULL,
                "amount" DECIMAL(15,2) NOT NULL,
                "category" "public"."expense_category_enum" NOT NULL DEFAULT 'other',
                "projectId" UUID,
                "date" DATE NOT NULL,
                "paymentMethod" VARCHAR,
                "receipt" VARCHAR,
                "vendor" VARCHAR,
                "notes" TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_expenses" PRIMARY KEY ("id"),
                CONSTRAINT "FK_expenses_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE SET NULL
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_expense_category" ON "expenses" ("category")`);
        await queryRunner.query(`CREATE INDEX "idx_expense_project" ON "expenses" ("projectId")`);
        await queryRunner.query(`CREATE INDEX "idx_expense_date" ON "expenses" ("date")`);

        // -- approvals --
        await queryRunner.query(`
            CREATE TABLE "approvals" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "type" VARCHAR NOT NULL,
                "title" VARCHAR NOT NULL,
                "requester" VARCHAR NOT NULL,
                "amount" INT,
                "items" JSONB,
                "description" TEXT NOT NULL,
                "status" VARCHAR NOT NULL DEFAULT 'pending',
                "requestedAt" DATE NOT NULL,
                "reviewedAt" DATE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_approvals" PRIMARY KEY ("id")
            )
        `);

        // -- contracts --
        await queryRunner.query(`
            CREATE TABLE "contracts" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "title" VARCHAR NOT NULL,
                "employeeName" VARCHAR NOT NULL,
                "department" VARCHAR NOT NULL,
                "type" VARCHAR NOT NULL,
                "startDate" DATE NOT NULL,
                "endDate" DATE,
                "status" VARCHAR NOT NULL DEFAULT 'active',
                "fileUrl" VARCHAR,
                "fileSize" VARCHAR,
                "body" TEXT,
                "footer" TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_contracts" PRIMARY KEY ("id")
            )
        `);

        // -- designs --
        await queryRunner.query(`
            CREATE TABLE "designs" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "title" VARCHAR NOT NULL,
                "description" TEXT,
                "type" "public"."design_type_enum" NOT NULL DEFAULT 'architectural',
                "status" "public"."design_status_enum" NOT NULL DEFAULT 'draft',
                "fileUrl" VARCHAR,
                "thumbnailUrl" VARCHAR,
                "projectId" UUID,
                "metadata" JSONB,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_designs" PRIMARY KEY ("id"),
                CONSTRAINT "FK_designs_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE SET NULL
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_design_type" ON "designs" ("type")`);
        await queryRunner.query(`CREATE INDEX "idx_design_status" ON "designs" ("status")`);
        await queryRunner.query(`CREATE INDEX "idx_design_created" ON "designs" ("createdAt")`);

        // -- payroll_records --
        await queryRunner.query(`
            CREATE TABLE "payroll_records" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "employeeId" UUID NOT NULL,
                "month" INT NOT NULL,
                "year" INT NOT NULL,
                "basicSalary" DECIMAL(12,2) NOT NULL,
                "allowances" JSONB,
                "deductions" JSONB,
                "totalAllowances" DECIMAL(12,2) NOT NULL DEFAULT 0,
                "totalDeductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
                "netSalary" DECIMAL(12,2) NOT NULL,
                "status" "public"."payroll_status_enum" NOT NULL DEFAULT 'draft',
                "paymentDate" DATE,
                "paymentMethod" VARCHAR,
                "notes" TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_payroll_records" PRIMARY KEY ("id"),
                CONSTRAINT "FK_payroll_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_payroll_employee" ON "payroll_records" ("employeeId")`);
        await queryRunner.query(`CREATE INDEX "idx_payroll_period" ON "payroll_records" ("month")`);
        await queryRunner.query(`CREATE INDEX "idx_payroll_status" ON "payroll_records" ("status")`);

        // -- attendance --
        await queryRunner.query(`
            CREATE TABLE "attendance" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "employeeId" UUID NOT NULL,
                "projectId" UUID,
                "site" VARCHAR,
                "date" DATE NOT NULL,
                "checkIn" TIME,
                "checkOut" TIME,
                "status" "public"."attendance_status_enum" NOT NULL DEFAULT 'present',
                "notes" TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_attendance" PRIMARY KEY ("id"),
                CONSTRAINT "FK_attendance_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_attendance_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE SET NULL
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_attendance_employee" ON "attendance" ("employeeId")`);
        await queryRunner.query(`CREATE INDEX "idx_attendance_date" ON "attendance" ("date")`);
        await queryRunner.query(`CREATE INDEX "idx_attendance_status" ON "attendance" ("status")`);

        // -- site_rules --
        await queryRunner.query(`
            CREATE TABLE "site_rules" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "title" VARCHAR NOT NULL,
                "iconName" VARCHAR,
                "pinColor" VARCHAR,
                "items" TEXT[] NOT NULL DEFAULT '{}',
                "order" INT NOT NULL DEFAULT 0,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "siteId" UUID,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_site_rules" PRIMARY KEY ("id"),
                CONSTRAINT "FK_site_rules_site" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_rule_site" ON "site_rules" ("siteId")`);

        // -- site_activities --
        await queryRunner.query(`
            CREATE TABLE "site_activities" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "project" UUID,
                "siteId" UUID,
                "date" DATE NOT NULL,
                "description" TEXT NOT NULL,
                "status" VARCHAR NOT NULL DEFAULT 'planned',
                "workers" INT NOT NULL DEFAULT 0,
                "notes" TEXT,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_site_activities" PRIMARY KEY ("id"),
                CONSTRAINT "FK_site_activities_site" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_site_activities_project" FOREIGN KEY ("project") REFERENCES "construction_projects"("id") ON DELETE SET NULL
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_activity_project" ON "site_activities" ("project")`);
        await queryRunner.query(`CREATE INDEX "idx_activity_site" ON "site_activities" ("siteId")`);

        // -- employee_assignments --
        await queryRunner.query(`
            CREATE TABLE "employee_assignments" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "employeeId" UUID NOT NULL,
                "projectId" UUID NOT NULL,
                "siteId" UUID,
                "task" VARCHAR,
                "role" "public"."assignment_role_enum" NOT NULL DEFAULT 'worker',
                "startDate" DATE NOT NULL,
                "endDate" DATE,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_employee_assignments" PRIMARY KEY ("id"),
                CONSTRAINT "FK_assignments_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_assignments_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_assignments_site" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE SET NULL
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_assignment_employee" ON "employee_assignments" ("employeeId")`);
        await queryRunner.query(`CREATE INDEX "idx_assignment_project" ON "employee_assignments" ("projectId")`);
        await queryRunner.query(`CREATE INDEX "idx_assignment_site" ON "employee_assignments" ("siteId")`);

        // -- material_requests --
        await queryRunner.query(`
            CREATE TABLE "material_requests" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "project" VARCHAR NOT NULL,
                "material" VARCHAR NOT NULL,
                "quantity" INT NOT NULL,
                "unit" VARCHAR NOT NULL DEFAULT 'pieces',
                "unitPrice" DECIMAL(15,2) NOT NULL DEFAULT 0,
                "totalCost" DECIMAL(15,2) NOT NULL DEFAULT 0,
                "date" DATE NOT NULL,
                "status" VARCHAR NOT NULL DEFAULT 'pending',
                "notes" TEXT,
                "createdById" VARCHAR,
                "createdByName" VARCHAR,
                "approvedById" VARCHAR,
                "approvedByName" VARCHAR,
                "approvedAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_material_requests" PRIMARY KEY ("id")
            )
        `);

        // -- project_evidence --
        await queryRunner.query(`
            CREATE TABLE "project_evidence" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "project" VARCHAR NOT NULL,
                "siteId" UUID,
                "type" VARCHAR NOT NULL,
                "title" VARCHAR NOT NULL,
                "url" VARCHAR NOT NULL,
                "date" DATE NOT NULL,
                "notes" TEXT,
                "approvedForClient" BOOLEAN NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_project_evidence" PRIMARY KEY ("id"),
                CONSTRAINT "FK_evidence_site" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_evidence_site" ON "project_evidence" ("siteId")`);

        // -- chat_conversations --
        await queryRunner.query(`
            CREATE TABLE "chat_conversations" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "sessionId" VARCHAR NOT NULL,
                "email" VARCHAR,
                "location" VARCHAR,
                "ipAddress" VARCHAR,
                "device" VARCHAR,
                "archived" BOOLEAN NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_chat_conversations" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_chat_session_id" ON "chat_conversations" ("sessionId")`);
        await queryRunner.query(`CREATE INDEX "idx_chat_archived" ON "chat_conversations" ("archived")`);
        await queryRunner.query(`CREATE INDEX "idx_chat_created" ON "chat_conversations" ("createdAt")`);

        // -- chat_messages --
        await queryRunner.query(`
            CREATE TABLE "chat_messages" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "content" VARCHAR NOT NULL,
                "sender" "public"."chat_sender_enum" NOT NULL DEFAULT 'user',
                "conversationId" UUID,
                "isRead" BOOLEAN NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_chat_messages" PRIMARY KEY ("id"),
                CONSTRAINT "FK_chat_messages_conversation" FOREIGN KEY ("conversationId") REFERENCES "chat_conversations"("id") ON DELETE CASCADE
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_msg_sender" ON "chat_messages" ("sender")`);
        await queryRunner.query(`CREATE INDEX "idx_msg_is_read" ON "chat_messages" ("isRead")`);
        await queryRunner.query(`CREATE INDEX "idx_msg_created" ON "chat_messages" ("createdAt")`);

        // -- visitors --
        await queryRunner.query(`
            CREATE TABLE "visitors" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "name" VARCHAR,
                "email" VARCHAR,
                "company" VARCHAR,
                "location" VARCHAR,
                "ipAddress" VARCHAR,
                "page" VARCHAR,
                "referrer" VARCHAR,
                "userAgent" VARCHAR,
                "metadata" JSONB,
                "visitedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_visitors" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_visitor_company" ON "visitors" ("company")`);
        await queryRunner.query(`CREATE INDEX "idx_visitor_location" ON "visitors" ("location")`);
        await queryRunner.query(`CREATE INDEX "idx_visitor_page" ON "visitors" ("page")`);
        await queryRunner.query(`CREATE INDEX "idx_visitor_visited_at" ON "visitors" ("visitedAt")`);

        // -- contact_messages --
        await queryRunner.query(`
            CREATE TABLE "contact_messages" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "name" VARCHAR NOT NULL,
                "email" VARCHAR NOT NULL,
                "phone" VARCHAR,
                "company" VARCHAR,
                "subject" VARCHAR,
                "message" TEXT NOT NULL,
                "status" "public"."message_status_enum" NOT NULL DEFAULT 'new',
                "ipAddress" VARCHAR,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "isDeleted" BOOLEAN NOT NULL DEFAULT false,
                "deletedAt" TIMESTAMP,
                "senderId" UUID,
                CONSTRAINT "PK_contact_messages" PRIMARY KEY ("id"),
                CONSTRAINT "FK_contact_messages_sender" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_contact_email" ON "contact_messages" ("email")`);
        await queryRunner.query(`CREATE INDEX "idx_contact_status" ON "contact_messages" ("status")`);
        await queryRunner.query(`CREATE INDEX "idx_contact_ip" ON "contact_messages" ("ipAddress")`);
        await queryRunner.query(`CREATE INDEX "idx_contact_created" ON "contact_messages" ("createdAt")`);
        await queryRunner.query(`CREATE INDEX "idx_contact_deleted" ON "contact_messages" ("isDeleted")`);

        // -- notifications --
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "type" "public"."notification_type_enum" NOT NULL,
                "title" VARCHAR NOT NULL,
                "message" TEXT NOT NULL,
                "status" "public"."notification_status_enum" NOT NULL DEFAULT 'pending',
                "isRead" BOOLEAN NOT NULL DEFAULT false,
                "metadata" JSONB,
                "userId" UUID,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "sentAt" TIMESTAMP,
                CONSTRAINT "PK_notifications" PRIMARY KEY ("id"),
                CONSTRAINT "FK_notifications_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_notif_type" ON "notifications" ("type")`);
        await queryRunner.query(`CREATE INDEX "idx_notif_status" ON "notifications" ("status")`);
        await queryRunner.query(`CREATE INDEX "idx_notif_is_read" ON "notifications" ("isRead")`);
        await queryRunner.query(`CREATE INDEX "idx_notif_created" ON "notifications" ("createdAt")`);

        // -- file_uploads --
        await queryRunner.query(`
            CREATE TABLE "file_uploads" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "publicId" VARCHAR NOT NULL,
                "url" VARCHAR NOT NULL,
                "secureUrl" VARCHAR NOT NULL,
                "format" VARCHAR,
                "resourceType" VARCHAR NOT NULL DEFAULT 'image',
                "originalFilename" VARCHAR NOT NULL,
                "bytes" INT,
                "width" INT,
                "height" INT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_file_uploads" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_file_public_id" ON "file_uploads" ("publicId")`);
        await queryRunner.query(`CREATE INDEX "idx_file_resource_type" ON "file_uploads" ("resourceType")`);
        await queryRunner.query(`CREATE INDEX "idx_file_created" ON "file_uploads" ("createdAt")`);

        // -- page_sections --
        await queryRunner.query(`
            CREATE TABLE "page_sections" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "page" VARCHAR NOT NULL,
                "section" VARCHAR NOT NULL,
                "title" TEXT,
                "subtitle" TEXT,
                "body" TEXT,
                "images" JSONB,
                "metadata" JSONB,
                "order" INT NOT NULL DEFAULT 0,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_page_sections" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_ps_page" ON "page_sections" ("page")`);
        await queryRunner.query(`CREATE INDEX "idx_ps_section" ON "page_sections" ("section")`);

        // -- permissions --
        await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "role" VARCHAR NOT NULL,
                "resource" VARCHAR NOT NULL,
                "action" VARCHAR NOT NULL,
                "allowed" BOOLEAN NOT NULL DEFAULT false,
                "conditions" VARCHAR(255),
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_permissions" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_perm_role_resource_action" UNIQUE ("role", "resource", "action")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_perm_role" ON "permissions" ("role")`);
        await queryRunner.query(`CREATE INDEX "idx_perm_resource" ON "permissions" ("resource")`);

        // -- subscribers --
        await queryRunner.query(`
            CREATE TABLE "subscribers" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "email" VARCHAR NOT NULL,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "source" VARCHAR,
                "mlScore" INT NOT NULL DEFAULT 50,
                "mlCategory" VARCHAR,
                "subscribedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_subscribers" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_subscribers_email" UNIQUE ("email")
            )
        `);

        // -- resources --
        await queryRunner.query(`
            CREATE TABLE "resources" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "type" "public"."resource_type_enum" NOT NULL,
                "title" VARCHAR NOT NULL,
                "content" TEXT,
                "metadata" JSONB,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_resources" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_resource_type" ON "resources" ("type")`);
        await queryRunner.query(`CREATE INDEX "idx_resource_created" ON "resources" ("createdAt")`);

        // -- partnerships --
        await queryRunner.query(`DROP TABLE IF EXISTS "partnerships" CASCADE`);
        await queryRunner.query(`
            CREATE TABLE "partnerships" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "companyName" VARCHAR NOT NULL,
                "contactPerson" VARCHAR,
                "email" VARCHAR,
                "phone" VARCHAR,
                "partnershipType" "public"."partnership_type_enum" NOT NULL,
                "status" "public"."partnership_status_enum" NOT NULL DEFAULT 'pending',
                "agreementFile" VARCHAR,
                "startDate" DATE,
                "endDate" DATE,
                "notes" TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_partnerships" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_partnership_type" ON "partnerships" ("partnershipType")`);
        await queryRunner.query(`CREATE INDEX "idx_partnership_status" ON "partnerships" ("status")`);
        await queryRunner.query(`CREATE INDEX "idx_partnership_created" ON "partnerships" ("createdAt")`);

        // -- audit_logs --
        await queryRunner.query(`
            CREATE TABLE "audit_logs" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "userId" VARCHAR NOT NULL,
                "userEmail" VARCHAR,
                "userRole" VARCHAR,
                "action" VARCHAR NOT NULL,
                "entity" VARCHAR,
                "entityId" VARCHAR,
                "metadata" JSONB,
                "ipAddress" VARCHAR,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_audit_user_id" ON "audit_logs" ("userId")`);
        await queryRunner.query(`CREATE INDEX "idx_audit_user_role" ON "audit_logs" ("userRole")`);
        await queryRunner.query(`CREATE INDEX "idx_audit_action" ON "audit_logs" ("action")`);
        await queryRunner.query(`CREATE INDEX "idx_audit_entity" ON "audit_logs" ("entity")`);
        await queryRunner.query(`CREATE INDEX "idx_audit_created" ON "audit_logs" ("createdAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse order
        await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "partnerships" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "resources" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "subscribers" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "permissions" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "page_sections" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "file_uploads" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "contact_messages" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "visitors" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_messages" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_conversations" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "project_evidence" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "material_requests" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "employee_assignments" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "site_activities" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "site_rules" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "attendance" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "payroll_records" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "designs" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "contracts" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "approvals" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "expenses" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "incomes" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "stock" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "categories" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "employees" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "sites" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "construction_projects" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "profiles" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);

        await queryRunner.query(`DROP TYPE IF EXISTS "public"."notification_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."notification_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."message_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."chat_sender_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."assignment_role_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."resource_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."partnership_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."partnership_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."design_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."design_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."attendance_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."payroll_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."expense_category_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."income_category_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."sites_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."projects_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."employees_department_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."employees_status_enum"`);
    }
}
