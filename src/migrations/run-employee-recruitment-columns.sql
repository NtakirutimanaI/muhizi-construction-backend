ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "workShift" character varying;
ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "employmentStatus" character varying;
ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "recruitedBy" character varying;
CREATE INDEX IF NOT EXISTS "idx_employee_recruited_by" ON "employees" ("recruitedBy");
