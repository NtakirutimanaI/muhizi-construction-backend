import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReorderTableColumns1730000000002 implements MigrationInterface {
    name = 'ReorderTableColumns1730000000002';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ---------------------------------------------------------------
        // 1. USERS table — recreate with columns in desired order
        // ---------------------------------------------------------------

        // Drop FK constraints referencing users
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "FK_profiles_user"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "FK_notifications_user"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT IF EXISTS "FK_stock_created_by"`);
        await queryRunner.query(`ALTER TABLE "client_reports" DROP CONSTRAINT IF EXISTS "FK_client_reports_creator"`);
        await queryRunner.query(`ALTER TABLE "design_reviews" DROP CONSTRAINT IF EXISTS "FK_design_reviews_reviewer"`);
        await queryRunner.query(`ALTER TABLE "stock_approvals" DROP CONSTRAINT IF EXISTS "FK_stock_approvals_approver"`);
        await queryRunner.query(`ALTER TABLE "contact_messages" DROP CONSTRAINT IF EXISTS "FK_contact_messages_sender"`);

        // Drop indexes on users
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_email"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_username"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_is_active"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_role"`);

        await queryRunner.query(`DROP TABLE IF EXISTS "users_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "users_old"`);
        await queryRunner.query(`ALTER TABLE "users_old" DROP CONSTRAINT IF EXISTS "PK_users"`);

        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstName" character varying,
                "lastName" character varying,
                "email" character varying NOT NULL,
                "username" character varying NOT NULL,
                "address" text,
                "phone" character varying,
                "gender" character varying,
                "maritalStatus" character varying,
                "nationalId" character varying,
                "educationLevel" character varying,
                "role" character varying NOT NULL DEFAULT 'admin',
                "password" character varying NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "refreshToken" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            INSERT INTO "users" (
                "id", "firstName", "lastName", "email", "username",
                "address", "phone", "gender", "maritalStatus", "nationalId", "educationLevel",
                "role", "password", "isActive", "refreshToken", "createdAt", "updatedAt"
            )
            SELECT
                "id", "firstName", "lastName", "email", "username",
                "address", "phone", "gender", "maritalStatus", "nationalId", "educationLevel",
                "role", "password", "isActive", "refreshToken", "createdAt", "updatedAt"
            FROM "users_old"
        `);

        await queryRunner.query(`DROP TABLE "users_old"`);

        // Recreate indexes
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_users_username" ON "users" ("username")`);
        await queryRunner.query(`CREATE INDEX "idx_users_is_active" ON "users" ("isActive")`);
        await queryRunner.query(`CREATE INDEX "idx_users_role" ON "users" ("role")`);

        // Recreate FK constraints
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_profiles_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_user" FOREIGN KEY ("userId") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_stock_created_by" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "client_reports" ADD CONSTRAINT "FK_client_reports_creator" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "design_reviews" ADD CONSTRAINT "FK_design_reviews_reviewer" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "stock_approvals" ADD CONSTRAINT "FK_stock_approvals_approver" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "contact_messages" ADD CONSTRAINT "FK_contact_messages_sender" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL`);

        // ---------------------------------------------------------------
        // 2. EMPLOYEES table — recreate with columns in desired order
        // ---------------------------------------------------------------

        await queryRunner.query(`ALTER TABLE "payroll_records" DROP CONSTRAINT IF EXISTS "FK_payroll_employee"`);
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT IF EXISTS "FK_attendance_employee"`);
        await queryRunner.query(`ALTER TABLE "employee_assignments" DROP CONSTRAINT IF EXISTS "FK_assignments_employee"`);
        await queryRunner.query(`ALTER TABLE "salary_rates" DROP CONSTRAINT IF EXISTS "FK_salary_rates_employee"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "idx_employee_email"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_employee_department"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_employee_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_employee_created"`);

        await queryRunner.query(`DROP TABLE IF EXISTS "employees_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "employees" RENAME TO "employees_old"`);
        await queryRunner.query(`ALTER TABLE "employees_old" DROP CONSTRAINT IF EXISTS "PK_employees"`);

        await queryRunner.query(`
            CREATE TABLE "employees" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phone" character varying,
                "address" character varying,
                "gender" character varying,
                "maritalStatus" character varying,
                "nationalId" character varying,
                "educationLevel" character varying,
                "position" character varying,
                "department" "employees_department_enum" DEFAULT 'other',
                "hireDate" date,
                "salary" decimal(12,2) DEFAULT 0,
                "status" "employees_status_enum" DEFAULT 'active',
                "emergencyContact" character varying,
                "avatar" character varying,
                "documents" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_employees" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            INSERT INTO "employees" (
                "id", "firstName", "lastName", "email", "phone", "address",
                "gender", "maritalStatus", "nationalId", "educationLevel",
                "position", "department", "hireDate", "salary", "status",
                "emergencyContact", "avatar", "documents", "createdAt", "updatedAt"
            )
            SELECT
                "id", "firstName", "lastName", "email", "phone", "address",
                "gender", "maritalStatus", "nationalId", "educationLevel",
                "position", "department", "hireDate", "salary", "status",
                "emergencyContact", "avatar", "documents", "createdAt", "updatedAt"
            FROM "employees_old"
        `);

        await queryRunner.query(`DROP TABLE "employees_old"`);

        await queryRunner.query(`CREATE UNIQUE INDEX "idx_employee_email" ON "employees" ("email")`);
        await queryRunner.query(`CREATE INDEX "idx_employee_department" ON "employees" ("department")`);
        await queryRunner.query(`CREATE INDEX "idx_employee_status" ON "employees" ("status")`);
        await queryRunner.query(`CREATE INDEX "idx_employee_created" ON "employees" ("createdAt")`);

        await queryRunner.query(`ALTER TABLE "payroll_records" ADD CONSTRAINT "FK_payroll_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "attendance" ADD CONSTRAINT "FK_attendance_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_assignments" ADD CONSTRAINT "FK_assignments_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "salary_rates" ADD CONSTRAINT "FK_salary_rates_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE`);

        // ---------------------------------------------------------------
        // 3. PROFILES table — recreate with columns in desired order
        // ---------------------------------------------------------------

        await queryRunner.query(`DROP INDEX IF EXISTS "idx_profiles_first_name"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_profiles_last_name"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_profiles_email"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_profiles_is_public"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_profiles_maintenance"`);

        await queryRunner.query(`DROP TABLE IF EXISTS "profiles_old" CASCADE`);
        await queryRunner.query(`ALTER TABLE "profiles" RENAME TO "profiles_old"`);
        await queryRunner.query(`ALTER TABLE "profiles_old" DROP CONSTRAINT IF EXISTS "PK_profiles"`);

        await queryRunner.query(`
            CREATE TABLE "profiles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "email" character varying,
                "phone" character varying,
                "address" character varying,
                "gender" character varying,
                "maritalStatus" character varying,
                "nationalId" character varying,
                "educationLevel" character varying,
                "dateOfBirth" TIMESTAMP,
                "location" character varying,
                "city" character varying,
                "country" character varying,
                "zipCode" character varying,
                "title" character varying,
                "type" character varying,
                "role" character varying,
                "yearsOfExperience" integer,
                "education" jsonb,
                "about" text,
                "experience" jsonb,
                "skills" jsonb,
                "projects" jsonb,
                "certifications" jsonb,
                "languages" jsonb,
                "teamMembers" jsonb,
                "socialLinks" jsonb,
                "company" character varying,
                "companyLogo" text,
                "cvUrl" text,
                "servicesOffered" text,
                "avatar_content" text,
                "bio" text,
                "greeting" character varying DEFAULT 'Hello',
                "aboutMeTitle" character varying DEFAULT 'A Bit About Me',
                "availableForHire" boolean NOT NULL DEFAULT true,
                "isPublic" boolean NOT NULL DEFAULT true,
                "allowMessages" boolean NOT NULL DEFAULT true,
                "showViews" boolean NOT NULL DEFAULT true,
                "maintenanceMode" boolean NOT NULL DEFAULT false,
                "preferences" jsonb,
                "poweredBy" character varying,
                "pageContent" jsonb,
                "userId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_profiles" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            INSERT INTO "profiles" (
                "id", "firstName", "lastName", "email", "phone", "address",
                "gender", "maritalStatus", "nationalId", "educationLevel",
                "dateOfBirth", "location", "city", "country", "zipCode",
                "title", "type", "role", "yearsOfExperience", "education", "about",
                "experience", "skills", "projects", "certifications", "languages",
                "teamMembers", "socialLinks", "company", "companyLogo", "cvUrl",
                "servicesOffered", "avatar_content", "bio", "greeting", "aboutMeTitle",
                "availableForHire", "isPublic", "allowMessages", "showViews", "maintenanceMode",
                "preferences", "poweredBy", "pageContent", "userId", "createdAt", "updatedAt"
            )
            SELECT
                "id", "firstName", "lastName", "email", "phone", "address",
                "gender", "maritalStatus", "nationalId", "educationLevel",
                "dateOfBirth", "location", "city", "country", "zipCode",
                "title", "type", "role", "yearsOfExperience", "education", "about",
                "experience", "skills", "projects", "certifications", "languages",
                "teamMembers", "socialLinks", "company", "companyLogo", "cvUrl",
                "servicesOffered", "avatar_content", "bio", "greeting", "aboutMeTitle",
                "availableForHire", "isPublic", "allowMessages", "showViews", "maintenanceMode",
                "preferences", "poweredBy", "pageContent", "userId", "createdAt", "updatedAt"
            FROM "profiles_old"
        `);

        await queryRunner.query(`DROP TABLE "profiles_old"`);

        await queryRunner.query(`CREATE INDEX "idx_profiles_first_name" ON "profiles" ("firstName")`);
        await queryRunner.query(`CREATE INDEX "idx_profiles_last_name" ON "profiles" ("lastName")`);
        await queryRunner.query(`CREATE INDEX "idx_profiles_email" ON "profiles" ("email")`);
        await queryRunner.query(`CREATE INDEX "idx_profiles_is_public" ON "profiles" ("isPublic")`);
        await queryRunner.query(`CREATE INDEX "idx_profiles_maintenance" ON "profiles" ("maintenanceMode")`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_profiles_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No down — this is a structural reorder, data has been migrated forward
    }
}
