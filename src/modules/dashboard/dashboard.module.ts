import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Project } from '../projects/entities/project.entity';
import { Approval } from '../approvals/entities/approval.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Income } from '../incomes/entities/income.entity';
import { Stock } from '../stock/entities/stock.entity';
import { MaterialRequest } from '../material-requests/entities/material-request.entity';
import { Site } from '../sites/entities/site.entity';
import { ProjectEvidence } from '../project-evidence/entities/project-evidence.entity';
import { Design } from '../designs/entities/design.entity';
import { EngineeringSubmission } from '../engineering-submissions/entities/engineering-submission.entity';
import { Task } from '../tasks/entities/task.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Project, Approval, Employee, Expense, Income, Stock, MaterialRequest, Site, ProjectEvidence, Design, EngineeringSubmission, Task])],
    controllers: [DashboardController],
    providers: [DashboardService],
    exports: [DashboardService],
})
export class DashboardModule {}
