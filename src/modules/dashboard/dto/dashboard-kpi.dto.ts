import { ApiProperty } from '@nestjs/swagger';

export class DashboardKpiDto {
    @ApiProperty({ example: 5, description: 'Number of currently active projects' })
    activeProjects: number;

    @ApiProperty({ example: 12, description: 'Number of pending approvals' })
    pendingApprovals: number;

    @ApiProperty({ example: 150, description: 'Total number of employees' })
    totalEmployees: number;

    @ApiProperty({ example: 45000000, description: 'Month-to-date expenses in RWF' })
    mtdExpenses: number;

    @ApiProperty({ example: 60000000, description: 'Month-to-date incomes in RWF' })
    mtdIncomes: number;

    @ApiProperty({ example: 3, description: 'Number of stock items below threshold' })
    stockAlerts: number;

    @ApiProperty({ example: 7, description: 'Number of pending material requests' })
    pendingMaterialRequests: number;

    @ApiProperty({ example: 8, description: 'Number of currently active sites' })
    activeSites: number;

    @ApiProperty({ example: 24, description: 'Number of recent evidence submissions' })
    recentEvidence: number;

    @ApiProperty({ example: 15000000, description: 'Current cash flow balance in RWF' })
    cashFlow: number;

    @ApiProperty({ example: 5.5, description: 'Budget variance percentage' })
    budgetVariance: number;
}
