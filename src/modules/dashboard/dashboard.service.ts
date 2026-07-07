import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { Approval } from '../approvals/entities/approval.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Income } from '../incomes/entities/income.entity';
import { Stock } from '../stock/entities/stock.entity';
import { MaterialRequest } from '../material-requests/entities/material-request.entity';
import { Site, SiteStatus } from '../sites/entities/site.entity';
import { ProjectEvidence } from '../project-evidence/entities/project-evidence.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Project) private projectRepo: Repository<Project>,
        @InjectRepository(Approval) private approvalRepo: Repository<Approval>,
        @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
        @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
        @InjectRepository(Income) private incomeRepo: Repository<Income>,
        @InjectRepository(Stock) private stockRepo: Repository<Stock>,
        @InjectRepository(MaterialRequest) private mrRepo: Repository<MaterialRequest>,
        @InjectRepository(Site) private siteRepo: Repository<Site>,
        @InjectRepository(ProjectEvidence) private evidenceRepo: Repository<ProjectEvidence>,
    ) {}

    async getAdminKpi() {
        const [activeProjects, pendingApprovals, totalEmployees, mtdExpenses, mtdIncomes, stockAlerts] = await Promise.all([
            this.projectRepo.count({ where: { status: ProjectStatus.IN_PROGRESS } }),
            this.approvalRepo.count({ where: { status: 'pending' } }),
            this.employeeRepo.count(),
            this.sumExpensesMonthToDate(),
            this.sumIncomesMonthToDate(),
            this.stockRepo.count({ where: { quantity: 0 as any } }),
        ]);
        return { activeProjects, pendingApprovals, totalEmployees, mtdExpenses, mtdIncomes, stockAlerts };
    }

    async getManagingDirectorKpi() {
        const [stockAlerts, pendingRequests, activeSites, recentEvidence] = await Promise.all([
            this.stockRepo.count({ where: { quantity: 0 as any } }),
            this.mrRepo.count({ where: { status: 'pending' } }),
            this.siteRepo.count({ where: { status: SiteStatus.ACTIVE } }),
            this.evidenceRepo.count(),
        ]);
        return { stockAlerts, pendingRequests, activeSites, recentEvidence };
    }

    async getFinanceDirectorKpi() {
        const [mtdIncomes, mtdExpenses, pendingPayments] = await Promise.all([
            this.sumIncomesMonthToDate(),
            this.sumExpensesMonthToDate(),
            this.approvalRepo.count({ where: { status: 'pending' } }),
        ]);
        const cashFlow = mtdIncomes - mtdExpenses;
        return { mtdIncomes, mtdExpenses, cashFlow, pendingPayments };
    }

    async getSiteEngineerKpi(userId: string) {
        const [assignedSites, pendingRequests] = await Promise.all([
            this.siteRepo.find(),
            this.mrRepo.count({ where: { status: 'pending', createdById: userId } }),
        ]);
        return { assignedSites: assignedSites.length, pendingRequests };
    }

    async getEngineeringStudioKpi() {
        return { assignedDesigns: 0, pendingSubmissions: 0 };
    }

    async getClientKpi() {
        const projects = await this.projectRepo.find();
        return { totalProjects: projects.length, activeProjects: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length };
    }

    private async sumExpensesMonthToDate() {
        const result = await this.expenseRepo.query(
            `SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE EXTRACT(MONTH FROM "createdAt") = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM CURRENT_DATE)`
        );
        return parseFloat(result[0]?.total || '0');
    }

    private async sumIncomesMonthToDate() {
        const result = await this.incomeRepo.query(
            `SELECT COALESCE(SUM(amount), 0) as total FROM incomes WHERE EXTRACT(MONTH FROM "createdAt") = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM CURRENT_DATE)`
        );
        return parseFloat(result[0]?.total || '0');
    }
}
