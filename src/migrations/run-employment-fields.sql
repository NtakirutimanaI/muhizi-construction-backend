ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "employmentStatus" character varying;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "employmentCategory" character varying;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "workShift" character varying;
