import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between } from 'typeorm';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { Approval } from '../approvals/entities/approval.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Income } from '../incomes/entities/income.entity';
import { Stock } from '../stock/entities/stock.entity';
import { MaterialRequest } from '../material-requests/entities/material-request.entity';
import { Site, SiteStatus } from '../sites/entities/site.entity';
import { ProjectEvidence } from '../project-evidence/entities/project-evidence.entity';
import { Design } from '../designs/entities/design.entity';
import { EngineeringSubmission } from '../engineering-submissions/entities/engineering-submission.entity';
import { Task } from '../tasks/entities/task.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { EmployeeAssignment } from '../employee-assignments/entities/employee-assignment.entity';

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
        @InjectRepository(Design) private designRepo: Repository<Design>,
        @InjectRepository(EngineeringSubmission) private submissionRepo: Repository<EngineeringSubmission>,
        @InjectRepository(Task) private taskRepo: Repository<Task>,
        @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>,
        @InjectRepository(EmployeeAssignment) private assignmentRepo: Repository<EmployeeAssignment>,
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
        const [stockAlerts, pendingRequests, activeSites, recentEvidence, mtdIncomes, mtdExpenses] = await Promise.all([
            this.stockRepo.count({ where: { quantity: 0 as any } }),
            this.mrRepo.count({ where: { status: 'pending' } }),
            this.siteRepo.count({ where: { status: SiteStatus.ACTIVE } }),
            this.evidenceRepo.count(),
            this.sumIncomesMonthToDate(),
            this.sumExpensesMonthToDate(),
        ]);
        const cashFlow = mtdIncomes - mtdExpenses;
        return { stockAlerts, pendingRequests, activeSites, recentEvidence, mtdIncomes, mtdExpenses, cashFlow };
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
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const mySites = await this.siteRepo.find({ where: { assignedEngineerId: userId } });
        const mySiteIds = mySites.map(s => s.id);
        const myProjectIds = [...new Set(mySites.map(s => s.projectId).filter(Boolean))] as string[];

        const [
            pendingRequests,
            activeSites,
            completedSites,
            totalEvidence,
            totalTasks,
            pendingTasks,
            completedTasks,
            inProgressTasks,
            totalTeamMembers,
        ] = await Promise.all([
            this.mrRepo.count({ where: { status: 'pending', createdById: userId } }),
            this.siteRepo.count({ where: { assignedEngineerId: userId, status: SiteStatus.ACTIVE } }),
            this.siteRepo.count({ where: { assignedEngineerId: userId, status: SiteStatus.COMPLETED } }),
            mySiteIds.length > 0
                ? this.evidenceRepo.count({ where: { siteId: In(mySiteIds) } })
                : Promise.resolve(0),
            this.taskRepo.count({ where: { assignedTo: userId } }),
            this.taskRepo.count({ where: { assignedTo: userId, status: 'pending' as any } }),
            this.taskRepo.count({ where: { assignedTo: userId, status: 'completed' as any } }),
            this.taskRepo.count({ where: { assignedTo: userId, status: 'in_progress' as any } }),
            this.assignmentRepo.count({ where: { projectId: In(myProjectIds) } }),
        ]);

        const todayAttendance = myProjectIds.length > 0
            ? await this.attendanceRepo.find({ where: { date: today, projectId: In(myProjectIds) } })
            : [];
        const todayPresent = todayAttendance.filter(a => a.status === 'present').length;
        const todayAbsent = todayAttendance.filter(a => a.status === 'absent').length;
        const todayLate = todayAttendance.filter(a => a.status === 'late').length;

        const recentAttendance = myProjectIds.length > 0
            ? await this.attendanceRepo.find({
                where: { date: In(this.dateRange(sevenDaysAgo, today)), projectId: In(myProjectIds) },
                order: { date: 'ASC' },
            })
            : [];
        const attendanceTrend: { date: string; present: number; absent: number; late: number }[] = [];
        for (let d = new Date(sevenDaysAgo); d <= new Date(today); d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const dayRecords = recentAttendance.filter(a => a.date === dateStr);
            attendanceTrend.push({
                date: dateStr,
                present: dayRecords.filter(a => a.status === 'present').length,
                absent: dayRecords.filter(a => a.status === 'absent').length,
                late: dayRecords.filter(a => a.status === 'late').length,
            });
        }

        const monthlyAttendance = myProjectIds.length > 0
            ? await this.attendanceRepo.find({
                where: { date: Between(startOfMonth, today), projectId: In(myProjectIds) },
            })
            : [];
        const monthlyPresent = monthlyAttendance.filter(a => a.status === 'present').length;
        const monthlyAbsent = monthlyAttendance.filter(a => a.status === 'absent').length;
        const monthlyLate = monthlyAttendance.filter(a => a.status === 'late').length;

        const siteStatusBreakdown = [
            { name: 'Active', value: activeSites },
            { name: 'Completed', value: completedSites },
            { name: 'Inactive', value: mySites.length - activeSites - completedSites },
        ].filter(d => d.value > 0);

        const taskBreakdown = [
            { name: 'Pending', value: pendingTasks },
            { name: 'In Progress', value: inProgressTasks },
            { name: 'Completed', value: completedTasks },
        ].filter(d => d.value > 0);

        return {
            assignedSites: mySites.length,
            activeSites,
            completedSites,
            pendingRequests,
            totalEvidence,
            totalTasks,
            pendingTasks,
            completedTasks,
            inProgressTasks,
            totalTeamMembers,
            todayPresent,
            todayAbsent,
            todayLate,
            monthlyPresent,
            monthlyAbsent,
            monthlyLate,
            attendanceTrend,
            siteStatusBreakdown,
            taskBreakdown,
        };
    }

    private dateRange(start: string, end: string): string[] {
        const dates: string[] = [];
        for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    }

    async getEngineeringStudioKpi(userId: string) {
        const [
            totalDesigns,
            approvedDesigns,
            mySubmissions,
            pendingSubmissions,
            approvedSubmissions,
            rejectedSubmissions,
            myTasks,
            pendingTasks,
            completedTasks,
        ] = await Promise.all([
            this.designRepo.count(),
            this.designRepo.count({ where: { status: 'approved' as any } }),
            this.submissionRepo.count({ where: { submittedBy: userId } }),
            this.submissionRepo.count({ where: { submittedBy: userId, status: 'submitted' as any } }),
            this.submissionRepo.count({ where: { submittedBy: userId, status: 'approved' as any } }),
            this.submissionRepo.count({ where: { submittedBy: userId, status: 'rejected' as any } }),
            this.taskRepo.count({ where: { assignedTo: userId } }),
            this.taskRepo.count({ where: { assignedTo: userId, status: 'pending' as any } }),
            this.taskRepo.count({ where: { assignedTo: userId, status: 'completed' as any } }),
        ]);
        return {
            totalDesigns,
            approvedDesigns,
            mySubmissions,
            pendingSubmissions,
            approvedSubmissions,
            rejectedSubmissions,
            myTasks,
            pendingTasks,
            completedTasks,
        };
    }

    async getPartnerKpi() {
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
