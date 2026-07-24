import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VoucherStatus } from '../entities/petty-cash-voucher.entity';

export class CreatePettyCashVoucherDto {
    // Header
    @ApiProperty({ example: '2026-07-23', description: 'Voucher date' })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiProperty({ example: 'REC-001', required: false, description: 'Reference number' })
    @IsString()
    @IsOptional()
    reference?: string;

    // Payee Information
    @ApiProperty({ example: 'Jean Ndayisaba', description: 'Recipient name' })
    @IsString()
    @IsNotEmpty()
    payeeName: string;

    @ApiProperty({ example: 'EMP-0042', required: false, description: 'Employee ID' })
    @IsString()
    @IsOptional()
    employeeId?: string;

    @ApiProperty({ example: 'Operations', required: false, description: 'Department' })
    @IsString()
    @IsOptional()
    department?: string;

    @ApiProperty({ example: 'Site Supervisor', required: false, description: 'Position' })
    @IsString()
    @IsOptional()
    position?: string;

    @ApiProperty({ example: '+250788123456', required: false, description: 'Phone number' })
    @IsString()
    @IsOptional()
    payeePhone?: string;

    @ApiProperty({ example: 'jean@muhizi.com', required: false, description: 'Email' })
    @IsString()
    @IsOptional()
    payeeEmail?: string;

    // Payment Details
    @ApiProperty({ example: 75000, description: 'Amount' })
    @IsNumber()
    @Min(0)
    amount: number;

    @ApiProperty({ example: 'RWF', required: false, description: 'Currency' })
    @IsString()
    @IsOptional()
    currency?: string;

    @ApiProperty({ example: 'Purchase of site safety equipment', description: 'Purpose of payment' })
    @IsString()
    @IsNotEmpty()
    paymentPurpose: string;

    @ApiProperty({ example: 'cash', required: false, description: 'Payment method' })
    @IsString()
    @IsOptional()
    paymentMethod?: string;

    @ApiProperty({ example: '2026-07-23', required: false, description: 'Payment date' })
    @IsDateString()
    @IsOptional()
    paymentDate?: string;

    @ApiProperty({ example: 'PCF-001', required: false, description: 'Cash fund/account' })
    @IsString()
    @IsOptional()
    cashFundAccount?: string;

    @ApiProperty({ example: 'Bought hard hats and safety vests for site team', required: false, description: 'Detailed description' })
    @IsString()
    @IsOptional()
    description?: string;

    // Approval
    @ApiProperty({ enum: VoucherStatus, required: false, description: 'Voucher status' })
    @IsEnum(VoucherStatus)
    @IsOptional()
    status?: VoucherStatus;

    // Requested By
    @ApiProperty({ required: false, description: 'Requested by name' })
    @IsString()
    @IsOptional()
    requestedByName?: string;

    @ApiProperty({ required: false, description: 'Requested by signature' })
    @IsString()
    @IsOptional()
    requestedBySignature?: string;

    @ApiProperty({ required: false, description: 'Request date' })
    @IsString()
    @IsOptional()
    requestedDate?: string;

    // Approved By
    @ApiProperty({ required: false, description: 'Approved by name' })
    @IsString()
    @IsOptional()
    approvedByName?: string;

    @ApiProperty({ required: false, description: 'Approved by signature' })
    @IsString()
    @IsOptional()
    approvedBySignature?: string;

    @ApiProperty({ required: false, description: 'Approval date' })
    @IsString()
    @IsOptional()
    approvedDate?: string;

    // Payment Confirmation
    @ApiProperty({ required: false, description: 'Confirmed by name' })
    @IsString()
    @IsOptional()
    confirmedByName?: string;

    @ApiProperty({ required: false, description: 'Confirmation date' })
    @IsString()
    @IsOptional()
    confirmedDate?: string;

    @ApiProperty({ required: false, description: 'Payment confirmation notes' })
    @IsString()
    @IsOptional()
    paymentConfirmationNotes?: string;

    // Fund Link
    @ApiProperty({ required: false, description: 'Petty cash fund ID' })
    @IsString()
    @IsOptional()
    fundId?: string;

    @ApiProperty({ required: false, description: 'Petty cash fund name' })
    @IsString()
    @IsOptional()
    fundName?: string;

    // Line Items
    @ApiProperty({ required: false, description: 'Line items for the voucher', type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, description: { type: 'string' }, expenseCategory: { type: 'string' }, debit: { type: 'number' }, credit: { type: 'number' }, quantity: { type: 'number' }, unitCost: { type: 'number' } } } })
    @IsOptional()
    lineItems?: { id: string; description: string; expenseCategory: string; debit: number; credit: number; quantity: number; unitCost: number }[];

    @ApiProperty({ example: 'office_supplies', required: false, description: 'Expense category' })
    @IsString()
    @IsOptional()
    expenseCategory?: string;

    // Checked By
    @ApiProperty({ required: false, description: 'Checked by name' })
    @IsString()
    @IsOptional()
    checkedByName?: string;

    @ApiProperty({ required: false, description: 'Checked by signature' })
    @IsString()
    @IsOptional()
    checkedBySignature?: string;

    @ApiProperty({ required: false, description: 'Check date' })
    @IsString()
    @IsOptional()
    checkedDate?: string;

    // Paid By
    @ApiProperty({ required: false, description: 'Paid by name' })
    @IsString()
    @IsOptional()
    paidByName?: string;

    @ApiProperty({ required: false, description: 'Paid by signature' })
    @IsString()
    @IsOptional()
    paidBySignature?: string;

    @ApiProperty({ required: false, description: 'Payment date' })
    @IsString()
    @IsOptional()
    paidDate?: string;

    // Received By
    @ApiProperty({ required: false, description: 'Received by name' })
    @IsString()
    @IsOptional()
    receivedByName?: string;

    @ApiProperty({ required: false, description: 'Received by signature' })
    @IsString()
    @IsOptional()
    receivedBySignature?: string;

    @ApiProperty({ required: false, description: 'Received date' })
    @IsString()
    @IsOptional()
    receivedDate?: string;

    // Supporting Documents
    @ApiProperty({ required: false, description: 'Supporting documents', type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, type: { type: 'string' }, url: { type: 'string' } } } })
    @IsOptional()
    supportingDocs?: { id: string; name: string; type: string; url: string }[];

    @ApiProperty({ required: false, description: 'Receipt URL' })
    @IsString()
    @IsOptional()
    receiptUrl?: string;

    // Notes & Transaction Type
    @ApiProperty({ required: false, description: 'Additional notes' })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ example: 'cash_issued', required: false, description: 'Transaction type' })
    @IsString()
    @IsOptional()
    transactionType?: string;

    // Transaction Lines
    @ApiProperty({ required: false, description: 'Transaction lines (Dr/Cr ledger)', type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, date: { type: 'string' }, description: { type: 'string' }, debit: { type: 'number' }, credit: { type: 'number' } } } })
    @IsOptional()
    transactions?: { id: string; date: string; description: string; debit: number; credit: number }[];

    // Software Version
    @ApiProperty({ example: 'v2.1.0', required: false, description: 'Software version' })
    @IsString()
    @IsOptional()
    softwareVersion?: string;
}
