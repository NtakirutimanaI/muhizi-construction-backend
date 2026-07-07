import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReorderAllTableColumns1730000000003 implements MigrationInterface {
    name = 'ReorderAllTableColumns1730000000003';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Drop all foreign key constraints
        await queryRunner.query(`ALTER TABLE "employee_assignments" DROP CONSTRAINT IF EXISTS "FK_assignments_employee"`);
        await queryRunner.query(`ALTER TABLE "employee_assignments" DROP CONSTRAINT IF EXISTS "FK_assignments_project"`);
        await queryRunner.query(`ALTER TABLE "employee_assignments" DROP CONSTRAINT IF EXISTS "FK_assignments_site"`);
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT IF EXISTS "FK_attendance_employee"`);
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT IF EXISTS "FK_attendance_project"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT IF EXISTS "FK_chat_messages_conversation"`);
        await queryRunner.query(`ALTER TABLE "client_reports" DROP CONSTRAINT IF EXISTS "FK_client_reports_creator"`);
        await queryRunner.query(`ALTER TABLE "client_reports" DROP CONSTRAINT IF EXISTS "FK_client_reports_project"`);
        await queryRunner.query(`ALTER TABLE "contact_messages" DROP CONSTRAINT IF EXISTS "FK_contact_messages_sender"`);
        await queryRunner.query(`ALTER TABLE "design_reviews" DROP CONSTRAINT IF EXISTS "FK_design_reviews_design"`);
        await queryRunner.query(`ALTER TABLE "design_reviews" DROP CONSTRAINT IF EXISTS "FK_design_reviews_reviewer"`);
        await queryRunner.query(`ALTER TABLE "designs" DROP CONSTRAINT IF EXISTS "FK_designs_project"`);
        await queryRunner.query(`ALTER TABLE "project_evidence" DROP CONSTRAINT IF EXISTS "FK_evidence_site"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT IF EXISTS "FK_expenses_project"`);
        await queryRunner.query(`ALTER TABLE "incomes" DROP CONSTRAINT IF EXISTS "FK_incomes_project"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "FK_notifications_user"`);
        await queryRunner.query(`ALTER TABLE "payroll_records" DROP CONSTRAINT IF EXISTS "FK_payroll_employee"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "FK_profiles_user"`);
        await queryRunner.query(`ALTER TABLE "salary_rates" DROP CONSTRAINT IF EXISTS "FK_salary_rates_employee"`);
        await queryRunner.query(`ALTER TABLE "site_activities" DROP CONSTRAINT IF EXISTS "FK_site_activities_project"`);
        await queryRunner.query(`ALTER TABLE "site_activities" DROP CONSTRAINT IF EXISTS "FK_site_activities_site"`);
        await queryRunner.query(`ALTER TABLE "site_rules" DROP CONSTRAINT IF EXISTS "FK_site_rules_site"`);
        await queryRunner.query(`ALTER TABLE "sites" DROP CONSTRAINT IF EXISTS "FK_sites_project"`);
        await queryRunner.query(`ALTER TABLE "stock_approvals" DROP CONSTRAINT IF EXISTS "FK_stock_approvals_approver"`);
        await queryRunner.query(`ALTER TABLE "stock_approvals" DROP CONSTRAINT IF EXISTS "FK_stock_approvals_stock"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT IF EXISTS "FK_stock_created_by"`);


        // --- construction_projects ---
        await queryRunner.query(`DROP TABLE IF EXISTS "construction_projects_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "construction_projects" RENAME TO "construction_projects_old"`);
        await queryRunner.query(`ALTER TABLE "construction_projects_old" DROP CONSTRAINT IF EXISTS "PK_construction_projects"`);

        await queryRunner.query(`
            CREATE TABLE "construction_projects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "clientName" character varying,
                "clientContact" character varying,
                "type" character varying NOT NULL DEFAULT 'construction',
                "status" "projects_status_enum" NOT NULL DEFAULT 'planning',
                "location" character varying,
                "startDate" date,
                "endDate" date,
                "budget" decimal(15,2),
                "spent" decimal(15,2),
                "progress" integer NOT NULL DEFAULT 0,
                "images" jsonb,
                "documents" jsonb,
                "milestones" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_construction_projects" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "construction_projects" ("id", "name", "description", "clientName", "clientContact", "type", "status", "location", "startDate", "endDate", "budget", "spent", "progress", "images", "documents", "milestones", "createdAt", "updatedAt") SELECT "id", "name", "description", "clientName", "clientContact", "type", "status", "location", "startDate", "endDate", "budget", "spent", "progress", "images", "documents", "milestones", "createdAt", "updatedAt" FROM "construction_projects_old"`);
        await queryRunner.query(`DROP TABLE "construction_projects_old"`);

        // --- sites ---
        await queryRunner.query(`DROP TABLE IF EXISTS "sites_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "sites" RENAME TO "sites_old"`);
        await queryRunner.query(`ALTER TABLE "sites_old" DROP CONSTRAINT IF EXISTS "PK_sites"`);

        await queryRunner.query(`
            CREATE TABLE "sites" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "location" character varying,
                "status" "sites_status_enum" NOT NULL DEFAULT 'active',
                "startDate" date,
                "endDate" date,
                "budget" decimal(15,2),
                "spent" decimal(15,2),
                "progress" integer NOT NULL DEFAULT 0,
                "images" jsonb,
                "projectId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_sites" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "sites" ("id", "name", "description", "location", "status", "startDate", "endDate", "budget", "spent", "progress", "images", "projectId", "createdAt", "updatedAt") SELECT "id", "name", "description", "location", "status", "startDate", "endDate", "budget", "spent", "progress", "images", "projectId", "createdAt", "updatedAt" FROM "sites_old"`);
        await queryRunner.query(`DROP TABLE "sites_old"`);

        // --- designs ---
        await queryRunner.query(`DROP TABLE IF EXISTS "designs_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "designs" RENAME TO "designs_old"`);
        await queryRunner.query(`ALTER TABLE "designs_old" DROP CONSTRAINT IF EXISTS "PK_designs"`);

        await queryRunner.query(`
            CREATE TABLE "designs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text,
                "type" "design_type_enum" NOT NULL DEFAULT 'architectural',
                "status" "design_status_enum" NOT NULL DEFAULT 'draft',
                "fileUrl" character varying,
                "thumbnailUrl" character varying,
                "projectId" uuid,
                "metadata" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_designs" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "designs" ("id", "title", "description", "type", "status", "fileUrl", "thumbnailUrl", "projectId", "metadata", "createdAt", "updatedAt") SELECT "id", "title", "description", "type", "status", "fileUrl", "thumbnailUrl", "projectId", "metadata", "createdAt", "updatedAt" FROM "designs_old"`);
        await queryRunner.query(`DROP TABLE "designs_old"`);

        // --- stock ---
        await queryRunner.query(`DROP TABLE IF EXISTS "stock_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "stock" RENAME TO "stock_old"`);
        await queryRunner.query(`ALTER TABLE "stock_old" DROP CONSTRAINT IF EXISTS "PK_stock"`);

        await queryRunner.query(`
            CREATE TABLE "stock" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "item" character varying NOT NULL,
                "category" character varying NOT NULL DEFAULT 'other',
                "type" character varying(10) NOT NULL,
                "unit" character varying NOT NULL DEFAULT 'pieces',
                "quantity" decimal(12,2) NOT NULL DEFAULT 0,
                "unitPrice" decimal(15,2) NOT NULL DEFAULT 0,
                "totalCost" decimal(15,2) NOT NULL DEFAULT 0,
                "date" date NOT NULL,
                "time" character varying(10),
                "reference" character varying,
                "notes" text,
                "createdById" uuid,
                "createdByName" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_stock" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "stock" ("id", "item", "category", "type", "unit", "quantity", "unitPrice", "totalCost", "date", "time", "reference", "notes", "createdById", "createdByName", "createdAt", "updatedAt") SELECT "id", "item", "category", "type", "unit", "quantity", "unitPrice", "totalCost", "date", "time", "reference", "notes", "createdById", "createdByName", "createdAt", "updatedAt" FROM "stock_old"`);
        await queryRunner.query(`DROP TABLE "stock_old"`);

        // --- material_requests ---
        await queryRunner.query(`DROP TABLE IF EXISTS "material_requests_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "material_requests" RENAME TO "material_requests_old"`);
        await queryRunner.query(`ALTER TABLE "material_requests_old" DROP CONSTRAINT IF EXISTS "PK_material_requests"`);

        await queryRunner.query(`
            CREATE TABLE "material_requests" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "project" character varying NOT NULL,
                "material" character varying NOT NULL,
                "unit" character varying NOT NULL DEFAULT 'pieces',
                "quantity" integer NOT NULL,
                "unitPrice" decimal(15,2) NOT NULL DEFAULT 0,
                "totalCost" decimal(15,2) NOT NULL DEFAULT 0,
                "status" character varying NOT NULL DEFAULT 'pending',
                "date" date NOT NULL,
                "notes" text,
                "createdById" character varying,
                "createdByName" character varying,
                "approvedById" character varying,
                "approvedByName" character varying,
                "approvedAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_material_requests" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "material_requests" ("id", "project", "material", "unit", "quantity", "unitPrice", "totalCost", "status", "date", "notes", "createdById", "createdByName", "approvedById", "approvedByName", "approvedAt", "createdAt", "updatedAt") SELECT "id", "project", "material", "unit", "quantity", "unitPrice", "totalCost", "status", "date", "notes", "createdById", "createdByName", "approvedById", "approvedByName", "approvedAt", "createdAt", "updatedAt" FROM "material_requests_old"`);
        await queryRunner.query(`DROP TABLE "material_requests_old"`);

        // --- expenses ---
        await queryRunner.query(`DROP TABLE IF EXISTS "expenses_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "expenses" RENAME TO "expenses_old"`);
        await queryRunner.query(`ALTER TABLE "expenses_old" DROP CONSTRAINT IF EXISTS "PK_expenses"`);

        await queryRunner.query(`
            CREATE TABLE "expenses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "description" character varying NOT NULL,
                "category" "expense_category_enum" NOT NULL DEFAULT 'other',
                "amount" decimal(15,2) NOT NULL,
                "vendor" character varying,
                "paymentMethod" character varying,
                "date" date NOT NULL,
                "receipt" character varying,
                "projectId" uuid,
                "notes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_expenses" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "expenses" ("id", "description", "category", "amount", "vendor", "paymentMethod", "date", "receipt", "projectId", "notes", "createdAt", "updatedAt") SELECT "id", "description", "category", "amount", "vendor", "paymentMethod", "date", "receipt", "projectId", "notes", "createdAt", "updatedAt" FROM "expenses_old"`);
        await queryRunner.query(`DROP TABLE "expenses_old"`);

        // --- incomes ---
        await queryRunner.query(`DROP TABLE IF EXISTS "incomes_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "incomes" RENAME TO "incomes_old"`);
        await queryRunner.query(`ALTER TABLE "incomes_old" DROP CONSTRAINT IF EXISTS "PK_incomes"`);

        await queryRunner.query(`
            CREATE TABLE "incomes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "description" character varying NOT NULL,
                "category" "income_category_enum" NOT NULL DEFAULT 'other',
                "amount" decimal(15,2) NOT NULL,
                "source" character varying,
                "paymentMethod" character varying,
                "date" date NOT NULL,
                "reference" character varying,
                "projectId" uuid,
                "notes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_incomes" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "incomes" ("id", "description", "category", "amount", "source", "paymentMethod", "date", "reference", "projectId", "notes", "createdAt", "updatedAt") SELECT "id", "description", "category", "amount", "source", "paymentMethod", "date", "reference", "projectId", "notes", "createdAt", "updatedAt" FROM "incomes_old"`);
        await queryRunner.query(`DROP TABLE "incomes_old"`);

        // --- payroll_records ---
        await queryRunner.query(`DROP TABLE IF EXISTS "payroll_records_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "payroll_records" RENAME TO "payroll_records_old"`);
        await queryRunner.query(`ALTER TABLE "payroll_records_old" DROP CONSTRAINT IF EXISTS "PK_payroll_records"`);

        await queryRunner.query(`
            CREATE TABLE "payroll_records" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "employeeId" uuid NOT NULL,
                "month" integer NOT NULL,
                "year" integer NOT NULL,
                "basicSalary" decimal(12,2) NOT NULL,
                "totalAllowances" decimal(12,2) NOT NULL DEFAULT 0,
                "totalDeductions" decimal(12,2) NOT NULL DEFAULT 0,
                "netSalary" decimal(12,2) NOT NULL,
                "allowances" jsonb,
                "deductions" jsonb,
                "status" "payroll_status_enum" NOT NULL DEFAULT 'draft',
                "paymentDate" date,
                "paymentMethod" character varying,
                "notes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_payroll_records" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "payroll_records" ("id", "employeeId", "month", "year", "basicSalary", "totalAllowances", "totalDeductions", "netSalary", "allowances", "deductions", "status", "paymentDate", "paymentMethod", "notes", "createdAt", "updatedAt") SELECT "id", "employeeId", "month", "year", "basicSalary", "totalAllowances", "totalDeductions", "netSalary", "allowances", "deductions", "status", "paymentDate", "paymentMethod", "notes", "createdAt", "updatedAt" FROM "payroll_records_old"`);
        await queryRunner.query(`DROP TABLE "payroll_records_old"`);

        // --- attendance ---
        await queryRunner.query(`DROP TABLE IF EXISTS "attendance_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "attendance" RENAME TO "attendance_old"`);
        await queryRunner.query(`ALTER TABLE "attendance_old" DROP CONSTRAINT IF EXISTS "PK_attendance"`);

        await queryRunner.query(`
            CREATE TABLE "attendance" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "employeeId" uuid NOT NULL,
                "date" date NOT NULL,
                "checkIn" time without time zone,
                "checkOut" time without time zone,
                "status" "attendance_status_enum" NOT NULL DEFAULT 'present',
                "site" character varying,
                "projectId" uuid,
                "notes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_attendance" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "attendance" ("id", "employeeId", "date", "checkIn", "checkOut", "status", "site", "projectId", "notes", "createdAt") SELECT "id", "employeeId", "date", "checkIn", "checkOut", "status", "site", "projectId", "notes", "createdAt" FROM "attendance_old"`);
        await queryRunner.query(`DROP TABLE "attendance_old"`);

        // --- contracts ---
        await queryRunner.query(`DROP TABLE IF EXISTS "contracts_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "contracts" RENAME TO "contracts_old"`);
        await queryRunner.query(`ALTER TABLE "contracts_old" DROP CONSTRAINT IF EXISTS "PK_contracts"`);

        await queryRunner.query(`
            CREATE TABLE "contracts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "employeeName" character varying NOT NULL,
                "department" character varying NOT NULL,
                "type" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'active',
                "startDate" date NOT NULL,
                "endDate" date,
                "fileUrl" character varying,
                "fileSize" character varying,
                "body" text,
                "footer" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_contracts" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "contracts" ("id", "title", "employeeName", "department", "type", "status", "startDate", "endDate", "fileUrl", "fileSize", "body", "footer", "createdAt", "updatedAt") SELECT "id", "title", "employeeName", "department", "type", "status", "startDate", "endDate", "fileUrl", "fileSize", "body", "footer", "createdAt", "updatedAt" FROM "contracts_old"`);
        await queryRunner.query(`DROP TABLE "contracts_old"`);

        // --- resources ---
        await queryRunner.query(`DROP TABLE IF EXISTS "resources_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "resources" RENAME TO "resources_old"`);
        await queryRunner.query(`ALTER TABLE "resources_old" DROP CONSTRAINT IF EXISTS "PK_resources"`);

        await queryRunner.query(`
            CREATE TABLE "resources" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" "resource_type_enum" NOT NULL,
                "title" character varying NOT NULL,
                "content" text,
                "metadata" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_resources" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "resources" ("id", "type", "title", "content", "metadata", "createdAt", "updatedAt") SELECT "id", "type", "title", "content", "metadata", "createdAt", "updatedAt" FROM "resources_old"`);
        await queryRunner.query(`DROP TABLE "resources_old"`);

        // --- partnerships ---
        await queryRunner.query(`DROP TABLE IF EXISTS "partnerships_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "partnerships" RENAME TO "partnerships_old"`);
        await queryRunner.query(`ALTER TABLE "partnerships_old" DROP CONSTRAINT IF EXISTS "PK_partnerships"`);

        await queryRunner.query(`
            CREATE TABLE "partnerships" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "companyName" character varying NOT NULL,
                "contactPerson" character varying,
                "email" character varying,
                "phone" character varying,
                "partnershipType" "partnership_type_enum" NOT NULL,
                "status" "partnership_status_enum" NOT NULL DEFAULT 'pending',
                "agreementFile" character varying,
                "startDate" date,
                "endDate" date,
                "notes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_partnerships" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "partnerships" ("id", "companyName", "contactPerson", "email", "phone", "partnershipType", "status", "agreementFile", "startDate", "endDate", "notes", "createdAt", "updatedAt") SELECT "id", "companyName", "contactPerson", "email", "phone", "partnershipType", "status", "agreementFile", "startDate", "endDate", "notes", "createdAt", "updatedAt" FROM "partnerships_old"`);
        await queryRunner.query(`DROP TABLE "partnerships_old"`);

        // --- approvals ---
        await queryRunner.query(`DROP TABLE IF EXISTS "approvals_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "approvals" RENAME TO "approvals_old"`);
        await queryRunner.query(`ALTER TABLE "approvals_old" DROP CONSTRAINT IF EXISTS "PK_approvals"`);

        await queryRunner.query(`
            CREATE TABLE "approvals" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "type" character varying NOT NULL,
                "requester" character varying NOT NULL,
                "description" text NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "requestedAt" date NOT NULL,
                "amount" integer,
                "items" jsonb,
                "reviewedAt" date,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_approvals" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "approvals" ("id", "title", "type", "requester", "description", "status", "requestedAt", "amount", "items", "reviewedAt", "createdAt", "updatedAt") SELECT "id", "title", "type", "requester", "description", "status", "requestedAt", "amount", "items", "reviewedAt", "createdAt", "updatedAt" FROM "approvals_old"`);
        await queryRunner.query(`DROP TABLE "approvals_old"`);

        // --- audit_logs ---
        await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "audit_logs" RENAME TO "audit_logs_old"`);
        await queryRunner.query(`ALTER TABLE "audit_logs_old" DROP CONSTRAINT IF EXISTS "PK_audit_logs"`);

        await queryRunner.query(`
            CREATE TABLE "audit_logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" character varying NOT NULL,
                "userEmail" character varying,
                "userRole" character varying,
                "action" character varying NOT NULL,
                "entity" character varying,
                "entityId" character varying,
                "ipAddress" character varying,
                "metadata" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "audit_logs" ("id", "userId", "userEmail", "userRole", "action", "entity", "entityId", "ipAddress", "metadata", "createdAt") SELECT "id", "userId", "userEmail", "userRole", "action", "entity", "entityId", "ipAddress", "metadata", "createdAt" FROM "audit_logs_old"`);
        await queryRunner.query(`DROP TABLE "audit_logs_old"`);

        // --- categories ---
        await queryRunner.query(`DROP TABLE IF EXISTS "categories_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME TO "categories_old"`);
        await queryRunner.query(`ALTER TABLE "categories_old" DROP CONSTRAINT IF EXISTS "PK_categories"`);

        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "value" character varying(100) NOT NULL,
                "label" character varying(200) NOT NULL,
                "isBuiltin" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_categories" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "categories" ("id", "value", "label", "isBuiltin", "createdAt", "updatedAt") SELECT "id", "value", "label", "isBuiltin", "createdAt", "updatedAt" FROM "categories_old"`);
        await queryRunner.query(`DROP TABLE "categories_old"`);

        // --- chat_conversations ---
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_conversations_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_conversations" RENAME TO "chat_conversations_old"`);
        await queryRunner.query(`ALTER TABLE "chat_conversations_old" DROP CONSTRAINT IF EXISTS "PK_chat_conversations"`);

        await queryRunner.query(`
            CREATE TABLE "chat_conversations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "sessionId" character varying NOT NULL,
                "email" character varying,
                "location" character varying,
                "ipAddress" character varying,
                "device" character varying,
                "archived" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_chat_conversations" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "chat_conversations" ("id", "sessionId", "email", "location", "ipAddress", "device", "archived", "createdAt", "updatedAt") SELECT "id", "sessionId", "email", "location", "ipAddress", "device", "archived", "createdAt", "updatedAt" FROM "chat_conversations_old"`);
        await queryRunner.query(`DROP TABLE "chat_conversations_old"`);

        // --- chat_messages ---
        await queryRunner.query(`DROP TABLE IF EXISTS "chat_messages_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_messages" RENAME TO "chat_messages_old"`);
        await queryRunner.query(`ALTER TABLE "chat_messages_old" DROP CONSTRAINT IF EXISTS "PK_chat_messages"`);

        await queryRunner.query(`
            CREATE TABLE "chat_messages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "content" character varying NOT NULL,
                "sender" "chat_sender_enum" NOT NULL DEFAULT 'user',
                "isRead" boolean NOT NULL DEFAULT false,
                "conversationId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_chat_messages" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "chat_messages" ("id", "content", "sender", "isRead", "conversationId", "createdAt") SELECT "id", "content", "sender", "isRead", "conversationId", "createdAt" FROM "chat_messages_old"`);
        await queryRunner.query(`DROP TABLE "chat_messages_old"`);

        // --- client_reports ---
        await queryRunner.query(`DROP TABLE IF EXISTS "client_reports_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "client_reports" RENAME TO "client_reports_old"`);
        await queryRunner.query(`ALTER TABLE "client_reports_old" DROP CONSTRAINT IF EXISTS "PK_client_reports"`);

        await queryRunner.query(`
            CREATE TABLE "client_reports" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text,
                "progressPercentage" decimal(5,2) NOT NULL DEFAULT 0,
                "status" character varying NOT NULL DEFAULT 'draft',
                "projectId" uuid NOT NULL,
                "createdById" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_client_reports" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "client_reports" ("id", "title", "description", "progressPercentage", "status", "projectId", "createdById", "createdAt", "updatedAt") SELECT "id", "title", "description", "progressPercentage", "status", "projectId", "createdById", "createdAt", "updatedAt" FROM "client_reports_old"`);
        await queryRunner.query(`DROP TABLE "client_reports_old"`);

        // --- design_reviews ---
        await queryRunner.query(`DROP TABLE IF EXISTS "design_reviews_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "design_reviews" RENAME TO "design_reviews_old"`);
        await queryRunner.query(`ALTER TABLE "design_reviews_old" DROP CONSTRAINT IF EXISTS "PK_design_reviews"`);

        await queryRunner.query(`
            CREATE TABLE "design_reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "status" character varying NOT NULL DEFAULT 'pending',
                "comments" text,
                "submittedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "reviewedAt" TIMESTAMP,
                "designId" uuid NOT NULL,
                "reviewerId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_design_reviews" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "design_reviews" ("id", "status", "comments", "submittedAt", "reviewedAt", "designId", "reviewerId", "createdAt", "updatedAt") SELECT "id", "status", "comments", "submittedAt", "reviewedAt", "designId", "reviewerId", "createdAt", "updatedAt" FROM "design_reviews_old"`);
        await queryRunner.query(`DROP TABLE "design_reviews_old"`);

        // --- employee_assignments ---
        await queryRunner.query(`DROP TABLE IF EXISTS "employee_assignments_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_assignments" RENAME TO "employee_assignments_old"`);
        await queryRunner.query(`ALTER TABLE "employee_assignments_old" DROP CONSTRAINT IF EXISTS "PK_employee_assignments"`);

        await queryRunner.query(`
            CREATE TABLE "employee_assignments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "employeeId" uuid NOT NULL,
                "projectId" uuid NOT NULL,
                "siteId" uuid,
                "task" character varying,
                "role" "assignment_role_enum" NOT NULL DEFAULT 'worker',
                "startDate" date NOT NULL,
                "endDate" date,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_employee_assignments" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "employee_assignments" ("id", "employeeId", "projectId", "siteId", "task", "role", "startDate", "endDate", "isActive", "createdAt", "updatedAt") SELECT "id", "employeeId", "projectId", "siteId", "task", "role", "startDate", "endDate", "isActive", "createdAt", "updatedAt" FROM "employee_assignments_old"`);
        await queryRunner.query(`DROP TABLE "employee_assignments_old"`);

        // --- file_uploads ---
        await queryRunner.query(`DROP TABLE IF EXISTS "file_uploads_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "file_uploads" RENAME TO "file_uploads_old"`);
        await queryRunner.query(`ALTER TABLE "file_uploads_old" DROP CONSTRAINT IF EXISTS "PK_file_uploads"`);

        await queryRunner.query(`
            CREATE TABLE "file_uploads" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "publicId" character varying NOT NULL,
                "originalFilename" character varying NOT NULL,
                "url" character varying NOT NULL,
                "secureUrl" character varying NOT NULL,
                "resourceType" character varying NOT NULL DEFAULT 'image',
                "format" character varying,
                "bytes" integer,
                "width" integer,
                "height" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_file_uploads" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "file_uploads" ("id", "publicId", "originalFilename", "url", "secureUrl", "resourceType", "format", "bytes", "width", "height", "createdAt") SELECT "id", "publicId", "originalFilename", "url", "secureUrl", "resourceType", "format", "bytes", "width", "height", "createdAt" FROM "file_uploads_old"`);
        await queryRunner.query(`DROP TABLE "file_uploads_old"`);

        // --- notifications ---
        await queryRunner.query(`DROP TABLE IF EXISTS "notifications_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "notifications" RENAME TO "notifications_old"`);
        await queryRunner.query(`ALTER TABLE "notifications_old" DROP CONSTRAINT IF EXISTS "PK_notifications"`);

        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "message" text NOT NULL,
                "type" "notification_type_enum" NOT NULL,
                "status" "notification_status_enum" NOT NULL DEFAULT 'pending',
                "isRead" boolean NOT NULL DEFAULT false,
                "sentAt" TIMESTAMP,
                "metadata" jsonb,
                "userId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "notifications" ("id", "title", "message", "type", "status", "isRead", "sentAt", "metadata", "userId", "createdAt") SELECT "id", "title", "message", "type", "status", "isRead", "sentAt", "metadata", "userId", "createdAt" FROM "notifications_old"`);
        await queryRunner.query(`DROP TABLE "notifications_old"`);

        // --- page_sections ---
        await queryRunner.query(`DROP TABLE IF EXISTS "page_sections_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "page_sections" RENAME TO "page_sections_old"`);
        await queryRunner.query(`ALTER TABLE "page_sections_old" DROP CONSTRAINT IF EXISTS "PK_page_sections"`);

        await queryRunner.query(`
            CREATE TABLE "page_sections" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "page" character varying NOT NULL,
                "section" character varying NOT NULL,
                "title" text,
                "subtitle" text,
                "body" text,
                "order" integer NOT NULL DEFAULT 0,
                "isActive" boolean NOT NULL DEFAULT true,
                "images" jsonb,
                "metadata" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_page_sections" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "page_sections" ("id", "page", "section", "title", "subtitle", "body", "order", "isActive", "images", "metadata", "createdAt", "updatedAt") SELECT "id", "page", "section", "title", "subtitle", "body", "order", "isActive", "images", "metadata", "createdAt", "updatedAt" FROM "page_sections_old"`);
        await queryRunner.query(`DROP TABLE "page_sections_old"`);

        // --- permissions ---
        await queryRunner.query(`DROP TABLE IF EXISTS "permissions_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "permissions" RENAME TO "permissions_old"`);
        await queryRunner.query(`ALTER TABLE "permissions_old" DROP CONSTRAINT IF EXISTS "PK_permissions"`);

        await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "role" character varying NOT NULL,
                "resource" character varying NOT NULL,
                "action" character varying NOT NULL,
                "allowed" boolean NOT NULL DEFAULT false,
                "conditions" character varying(255),
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_permissions" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "permissions" ("id", "role", "resource", "action", "allowed", "conditions", "isActive", "createdAt", "updatedAt") SELECT "id", "role", "resource", "action", "allowed", "conditions", "isActive", "createdAt", "updatedAt" FROM "permissions_old"`);
        await queryRunner.query(`DROP TABLE "permissions_old"`);

        // --- project_evidence ---
        await queryRunner.query(`DROP TABLE IF EXISTS "project_evidence_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_evidence" RENAME TO "project_evidence_old"`);
        await queryRunner.query(`ALTER TABLE "project_evidence_old" DROP CONSTRAINT IF EXISTS "PK_project_evidence"`);

        await queryRunner.query(`
            CREATE TABLE "project_evidence" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "project" character varying NOT NULL,
                "title" character varying NOT NULL,
                "type" character varying NOT NULL,
                "url" character varying NOT NULL,
                "date" date NOT NULL,
                "notes" text,
                "approvedForClient" boolean NOT NULL DEFAULT false,
                "siteId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_project_evidence" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "project_evidence" ("id", "project", "title", "type", "url", "date", "notes", "approvedForClient", "siteId", "createdAt", "updatedAt") SELECT "id", "project", "title", "type", "url", "date", "notes", "approvedForClient", "siteId", "createdAt", "updatedAt" FROM "project_evidence_old"`);
        await queryRunner.query(`DROP TABLE "project_evidence_old"`);

        // --- salary_rates ---
        await queryRunner.query(`DROP TABLE IF EXISTS "salary_rates_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "salary_rates" RENAME TO "salary_rates_old"`);
        await queryRunner.query(`ALTER TABLE "salary_rates_old" DROP CONSTRAINT IF EXISTS "PK_salary_rates"`);

        await queryRunner.query(`
            CREATE TABLE "salary_rates" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "role" character varying,
                "baseSalary" decimal(12,2) NOT NULL,
                "contractType" character varying NOT NULL DEFAULT 'contracted',
                "effectiveFrom" date NOT NULL,
                "effectiveTo" date,
                "employeeId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_salary_rates" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "salary_rates" ("id", "role", "baseSalary", "contractType", "effectiveFrom", "effectiveTo", "employeeId", "createdAt", "updatedAt") SELECT "id", "role", "baseSalary", "contractType", "effectiveFrom", "effectiveTo", "employeeId", "createdAt", "updatedAt" FROM "salary_rates_old"`);
        await queryRunner.query(`DROP TABLE "salary_rates_old"`);

        // --- system_settings ---
        await queryRunner.query(`DROP TABLE IF EXISTS "system_settings_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "system_settings" RENAME TO "system_settings_old"`);
        await queryRunner.query(`ALTER TABLE "system_settings_old" DROP CONSTRAINT IF EXISTS "PK_system_settings"`);

        await queryRunner.query(`
            CREATE TABLE "system_settings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "key" character varying NOT NULL,
                "value" text NOT NULL,
                "category" character varying NOT NULL DEFAULT 'general',
                "description" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_system_settings" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "system_settings" ("id", "key", "value", "category", "description", "createdAt", "updatedAt") SELECT "id", "key", "value", "category", "description", "createdAt", "updatedAt" FROM "system_settings_old"`);
        await queryRunner.query(`DROP TABLE "system_settings_old"`);

        // --- site_activities ---
        await queryRunner.query(`DROP TABLE IF EXISTS "site_activities_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "site_activities" RENAME TO "site_activities_old"`);
        await queryRunner.query(`ALTER TABLE "site_activities_old" DROP CONSTRAINT IF EXISTS "PK_site_activities"`);

        await queryRunner.query(`
            CREATE TABLE "site_activities" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "project" uuid NOT NULL,
                "date" date NOT NULL,
                "description" text NOT NULL,
                "status" character varying NOT NULL DEFAULT 'planned',
                "workers" integer NOT NULL DEFAULT 0,
                "notes" text,
                "isActive" boolean NOT NULL DEFAULT true,
                "siteId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_site_activities" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "site_activities" ("id", "project", "date", "description", "status", "workers", "notes", "isActive", "siteId", "createdAt", "updatedAt") SELECT "id", "project", "date", "description", "status", "workers", "notes", "isActive", "siteId", "createdAt", "updatedAt" FROM "site_activities_old"`);
        await queryRunner.query(`DROP TABLE "site_activities_old"`);

        // --- site_rules ---
        await queryRunner.query(`DROP TABLE IF EXISTS "site_rules_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "site_rules" RENAME TO "site_rules_old"`);
        await queryRunner.query(`ALTER TABLE "site_rules_old" DROP CONSTRAINT IF EXISTS "PK_site_rules"`);

        await queryRunner.query(`
            CREATE TABLE "site_rules" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "iconName" character varying,
                "pinColor" character varying,
                "items" text[] NOT NULL,
                "order" integer NOT NULL DEFAULT 0,
                "isActive" boolean NOT NULL DEFAULT true,
                "siteId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_site_rules" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "site_rules" ("id", "title", "iconName", "pinColor", "items", "order", "isActive", "siteId", "createdAt", "updatedAt") SELECT "id", "title", "iconName", "pinColor", "items", "order", "isActive", "siteId", "createdAt", "updatedAt" FROM "site_rules_old"`);
        await queryRunner.query(`DROP TABLE "site_rules_old"`);

        // --- stock_approvals ---
        await queryRunner.query(`DROP TABLE IF EXISTS "stock_approvals_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "stock_approvals" RENAME TO "stock_approvals_old"`);
        await queryRunner.query(`ALTER TABLE "stock_approvals_old" DROP CONSTRAINT IF EXISTS "PK_stock_approvals"`);

        await queryRunner.query(`
            CREATE TABLE "stock_approvals" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "status" character varying NOT NULL DEFAULT 'pending',
                "comments" text,
                "type" character varying NOT NULL DEFAULT 'co_sign',
                "stockId" uuid NOT NULL,
                "approvedById" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_stock_approvals" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "stock_approvals" ("id", "status", "comments", "type", "stockId", "approvedById", "createdAt", "updatedAt") SELECT "id", "status", "comments", "type", "stockId", "approvedById", "createdAt", "updatedAt" FROM "stock_approvals_old"`);
        await queryRunner.query(`DROP TABLE "stock_approvals_old"`);

        // --- subscribers ---
        await queryRunner.query(`DROP TABLE IF EXISTS "subscribers_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "subscribers" RENAME TO "subscribers_old"`);
        await queryRunner.query(`ALTER TABLE "subscribers_old" DROP CONSTRAINT IF EXISTS "PK_subscribers"`);

        await queryRunner.query(`
            CREATE TABLE "subscribers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "source" character varying,
                "mlScore" integer NOT NULL DEFAULT 50,
                "mlCategory" character varying,
                "subscribedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_subscribers" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "subscribers" ("id", "email", "isActive", "source", "mlScore", "mlCategory", "subscribedAt", "updatedAt") SELECT "id", "email", "isActive", "source", "mlScore", "mlCategory", "subscribedAt", "updatedAt" FROM "subscribers_old"`);
        await queryRunner.query(`DROP TABLE "subscribers_old"`);

        // --- visitors ---
        await queryRunner.query(`DROP TABLE IF EXISTS "visitors_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "visitors" RENAME TO "visitors_old"`);
        await queryRunner.query(`ALTER TABLE "visitors_old" DROP CONSTRAINT IF EXISTS "PK_visitors"`);

        await queryRunner.query(`
            CREATE TABLE "visitors" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying,
                "email" character varying,
                "company" character varying,
                "location" character varying,
                "ipAddress" character varying,
                "page" character varying,
                "referrer" character varying,
                "userAgent" character varying,
                "metadata" jsonb,
                "visitedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_visitors" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "visitors" ("id", "name", "email", "company", "location", "ipAddress", "page", "referrer", "userAgent", "metadata", "visitedAt") SELECT "id", "name", "email", "company", "location", "ipAddress", "page", "referrer", "userAgent", "metadata", "visitedAt" FROM "visitors_old"`);
        await queryRunner.query(`DROP TABLE "visitors_old"`);

        // --- contact_messages ---
        await queryRunner.query(`DROP TABLE IF EXISTS "contact_messages_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "contact_messages" RENAME TO "contact_messages_old"`);
        await queryRunner.query(`ALTER TABLE "contact_messages_old" DROP CONSTRAINT IF EXISTS "PK_contact_messages"`);

        await queryRunner.query(`
            CREATE TABLE "contact_messages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phone" character varying,
                "company" character varying,
                "subject" character varying,
                "message" text NOT NULL,
                "status" "message_status_enum" NOT NULL DEFAULT 'new',
                "ipAddress" character varying,
                "isDeleted" boolean NOT NULL DEFAULT false,
                "deletedAt" TIMESTAMP,
                "senderId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_contact_messages" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`INSERT INTO "contact_messages" ("id", "name", "email", "phone", "company", "subject", "message", "status", "ipAddress", "isDeleted", "deletedAt", "senderId", "createdAt") SELECT "id", "name", "email", "phone", "company", "subject", "message", "status", "ipAddress", "isDeleted", "deletedAt", "senderId", "createdAt" FROM "contact_messages_old"`);
        await queryRunner.query(`DROP TABLE "contact_messages_old"`);

        // --- Recreate indexes ---
        await queryRunner.query(`CREATE INDEX "idx_project_status" ON "construction_projects" (status)`);
        await queryRunner.query(`CREATE INDEX "idx_project_created" ON "construction_projects" ("createdAt")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_site_name" ON "sites" (name)`);
        await queryRunner.query(`CREATE INDEX "idx_site_status" ON "sites" (status)`);
        await queryRunner.query(`CREATE INDEX "idx_site_project" ON "sites" ("projectId")`);
        await queryRunner.query(`CREATE INDEX "idx_design_type" ON "designs" (type)`);
        await queryRunner.query(`CREATE INDEX "idx_design_status" ON "designs" (status)`);
        await queryRunner.query(`CREATE INDEX "idx_design_created" ON "designs" ("createdAt")`);
        await queryRunner.query(`CREATE INDEX "idx_stock_category" ON "stock" (category)`);
        await queryRunner.query(`CREATE INDEX "idx_stock_type" ON "stock" (type)`);
        await queryRunner.query(`CREATE INDEX "idx_stock_created_by" ON "stock" ("createdById")`);
        await queryRunner.query(`CREATE INDEX "idx_expense_category" ON "expenses" (category)`);
        await queryRunner.query(`CREATE INDEX "idx_expense_date" ON "expenses" (date)`);
        await queryRunner.query(`CREATE INDEX "idx_expense_project" ON "expenses" ("projectId")`);
        await queryRunner.query(`CREATE INDEX "idx_income_category" ON "incomes" (category)`);
        await queryRunner.query(`CREATE INDEX "idx_income_date" ON "incomes" (date)`);
        await queryRunner.query(`CREATE INDEX "idx_income_project" ON "incomes" ("projectId")`);
        await queryRunner.query(`CREATE INDEX "idx_payroll_employee" ON "payroll_records" ("employeeId")`);
        await queryRunner.query(`CREATE INDEX "idx_payroll_period" ON "payroll_records" (month, year)`);
        await queryRunner.query(`CREATE INDEX "idx_payroll_status" ON "payroll_records" (status)`);
        await queryRunner.query(`CREATE INDEX "idx_attendance_employee" ON "attendance" ("employeeId")`);
        await queryRunner.query(`CREATE INDEX "idx_attendance_date" ON "attendance" (date)`);
        await queryRunner.query(`CREATE INDEX "idx_attendance_status" ON "attendance" (status)`);
        await queryRunner.query(`CREATE INDEX "idx_resource_type" ON "resources" (type)`);
        await queryRunner.query(`CREATE INDEX "idx_resource_created" ON "resources" ("createdAt")`);
        await queryRunner.query(`CREATE INDEX "idx_partnership_type" ON "partnerships" ("partnershipType")`);
        await queryRunner.query(`CREATE INDEX "idx_partnership_status" ON "partnerships" (status)`);
        await queryRunner.query(`CREATE INDEX "idx_partnership_created" ON "partnerships" ("createdAt")`);
        await queryRunner.query(`CREATE INDEX "idx_audit_user_id" ON "audit_logs" ("userId")`);
        await queryRunner.query(`CREATE INDEX "idx_audit_user_role" ON "audit_logs" ("userRole")`);
        await queryRunner.query(`CREATE INDEX "idx_audit_action" ON "audit_logs" (action)`);
        await queryRunner.query(`CREATE INDEX "idx_audit_entity" ON "audit_logs" (entity)`);
        await queryRunner.query(`CREATE INDEX "idx_audit_created" ON "audit_logs" ("createdAt")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_categories_value" ON "categories" (value)`);
        await queryRunner.query(`CREATE INDEX "idx_chat_session_id" ON "chat_conversations" ("sessionId")`);
        await queryRunner.query(`CREATE INDEX "idx_chat_archived" ON "chat_conversations" (archived)`);
        await queryRunner.query(`CREATE INDEX "idx_chat_created" ON "chat_conversations" ("createdAt")`);
        await queryRunner.query(`CREATE INDEX "idx_msg_sender" ON "chat_messages" (sender)`);
        await queryRunner.query(`CREATE INDEX "idx_msg_is_read" ON "chat_messages" ("isRead")`);
        await queryRunner.query(`CREATE INDEX "idx_msg_created" ON "chat_messages" ("createdAt")`);
        await queryRunner.query(`CREATE INDEX "idx_assignment_employee" ON "employee_assignments" ("employeeId")`);
        await queryRunner.query(`CREATE INDEX "idx_assignment_project" ON "employee_assignments" ("projectId")`);
        await queryRunner.query(`CREATE INDEX "idx_assignment_site" ON "employee_assignments" ("siteId")`);
        await queryRunner.query(`CREATE INDEX "idx_file_public_id" ON "file_uploads" ("publicId")`);
        await queryRunner.query(`CREATE INDEX "idx_file_resource_type" ON "file_uploads" ("resourceType")`);
        await queryRunner.query(`CREATE INDEX "idx_file_created" ON "file_uploads" ("createdAt")`);
        await queryRunner.query(`CREATE INDEX "idx_notif_type" ON "notifications" (type)`);
        await queryRunner.query(`CREATE INDEX "idx_notif_status" ON "notifications" (status)`);
        await queryRunner.query(`CREATE INDEX "idx_notif_is_read" ON "notifications" ("isRead")`);
        await queryRunner.query(`CREATE INDEX "idx_notif_created" ON "notifications" ("createdAt")`);
        await queryRunner.query(`CREATE INDEX "idx_ps_page" ON "page_sections" (page)`);
        await queryRunner.query(`CREATE INDEX "idx_ps_section" ON "page_sections" (section)`);
        await queryRunner.query(`CREATE INDEX "idx_perm_role" ON "permissions" (role)`);
        await queryRunner.query(`CREATE INDEX "idx_perm_resource" ON "permissions" (resource)`);
        await queryRunner.query(`CREATE INDEX "idx_evidence_site" ON "project_evidence" ("siteId")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_settings_key" ON "system_settings" (key)`);
        await queryRunner.query(`CREATE INDEX "idx_activity_project" ON "site_activities" (project)`);
        await queryRunner.query(`CREATE INDEX "idx_activity_site" ON "site_activities" ("siteId")`);
        await queryRunner.query(`CREATE INDEX "idx_rule_site" ON "site_rules" ("siteId")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_subscriber_email" ON "subscribers" (email)`);
        await queryRunner.query(`CREATE INDEX "idx_visitor_company" ON "visitors" (company)`);
        await queryRunner.query(`CREATE INDEX "idx_visitor_location" ON "visitors" (location)`);
        await queryRunner.query(`CREATE INDEX "idx_visitor_page" ON "visitors" (page)`);
        await queryRunner.query(`CREATE INDEX "idx_visitor_visited_at" ON "visitors" ("visitedAt")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_contact_email" ON "contact_messages" (email)`);
        await queryRunner.query(`CREATE INDEX "idx_contact_status" ON "contact_messages" (status)`);
        await queryRunner.query(`CREATE INDEX "idx_contact_ip" ON "contact_messages" ("ipAddress")`);
        await queryRunner.query(`CREATE INDEX "idx_contact_deleted" ON "contact_messages" ("isDeleted")`);
        await queryRunner.query(`CREATE INDEX "idx_contact_created" ON "contact_messages" ("createdAt")`);

        // --- Recreate foreign keys ---
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_profiles_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_user" FOREIGN KEY ("userId") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_stock_created_by" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "client_reports" ADD CONSTRAINT "FK_client_reports_creator" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "design_reviews" ADD CONSTRAINT "FK_design_reviews_reviewer" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "stock_approvals" ADD CONSTRAINT "FK_stock_approvals_approver" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "contact_messages" ADD CONSTRAINT "FK_contact_messages_sender" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "payroll_records" ADD CONSTRAINT "FK_payroll_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "attendance" ADD CONSTRAINT "FK_attendance_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_assignments" ADD CONSTRAINT "FK_assignments_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "salary_rates" ADD CONSTRAINT "FK_salary_rates_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_assignments" ADD CONSTRAINT "FK_assignments_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "attendance" ADD CONSTRAINT "FK_attendance_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "client_reports" ADD CONSTRAINT "FK_client_reports_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "designs" ADD CONSTRAINT "FK_designs_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD CONSTRAINT "FK_expenses_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "incomes" ADD CONSTRAINT "FK_incomes_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "site_activities" ADD CONSTRAINT "FK_site_activities_project" FOREIGN KEY ("project") REFERENCES "construction_projects"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "sites" ADD CONSTRAINT "FK_sites_project" FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_assignments" ADD CONSTRAINT "FK_assignments_site" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "project_evidence" ADD CONSTRAINT "FK_evidence_site" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "site_activities" ADD CONSTRAINT "FK_site_activities_site" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "site_rules" ADD CONSTRAINT "FK_site_rules_site" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "design_reviews" ADD CONSTRAINT "FK_design_reviews_design" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_chat_messages_conversation" FOREIGN KEY ("conversationId") REFERENCES "chat_conversations"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "stock_approvals" ADD CONSTRAINT "FK_stock_approvals_stock" FOREIGN KEY ("stockId") REFERENCES "stock"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No down — data has been migrated forward
    }
}
