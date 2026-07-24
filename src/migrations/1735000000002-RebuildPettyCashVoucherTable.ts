import { MigrationInterface, QueryRunner } from 'typeorm';

export class RebuildPettyCashVoucherTable1735000000002 implements MigrationInterface {
    name = 'RebuildPettyCashVoucherTable1735000000002';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "petty_cash_vouchers"`);

        await queryRunner.query(`
            CREATE TABLE "petty_cash_vouchers" (
                "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
                "voucherNumber" character varying NOT NULL,
                "date" date NOT NULL,
                "reference" character varying,
                "status" character varying NOT NULL DEFAULT 'draft',

                "payeeName" character varying NOT NULL,
                "employeeId" character varying,
                "department" character varying,
                "position" character varying,
                "payeePhone" character varying,
                "payeeEmail" character varying,

                "amount" numeric(15,2) NOT NULL,
                "currency" character varying NOT NULL DEFAULT 'RWF',
                "paymentPurpose" character varying NOT NULL,
                "paymentMethod" character varying,
                "paymentDate" date,
                "cashFundAccount" character varying,
                "description" text,

                "requestedByName" character varying,
                "requestedBySignature" character varying,
                "requestedDate" character varying,

                "approvedByName" character varying,
                "approvedBySignature" character varying,
                "approvedDate" character varying,
                "rejectionReason" character varying,

                "confirmedByName" character varying,
                "confirmedDate" character varying,
                "paymentConfirmationNotes" text,

                "createdById" character varying,
                "createdByName" character varying,
                "lastModifiedById" character varying,
                "lastModifiedByName" character varying,
                "softwareVersion" character varying,

                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),

                CONSTRAINT "PK_petty_cash_voucher_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_petty_cash_voucher_number" UNIQUE ("voucherNumber")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "petty_cash_vouchers"`);
    }
}
