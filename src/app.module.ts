import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { EventsModule } from './modules/events/events.module';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './modules/upload/upload.module';
import { CacheModule } from './modules/cache/cache.module';
import { AuditModule } from './modules/audit/audit.module';
import { MlModule } from './modules/ml/ml.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { DesignsModule } from './modules/designs/designs.module';
import { PartnershipsModule } from './modules/partnerships/partnerships.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { IncomesModule } from './modules/incomes/incomes.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { MaterialRequestsModule } from './modules/material-requests/material-requests.module';
import { ProjectEvidenceModule } from './modules/project-evidence/project-evidence.module';
import { SitesModule } from './modules/sites/sites.module';
import { SiteActivitiesModule } from './modules/site-activities/site-activities.module';
import { SiteRulesModule } from './modules/site-rules/site-rules.module';
import { EmployeeAssignmentsModule } from './modules/employee-assignments/employee-assignments.module';
import { SubscribersModule } from './modules/subscribers/subscribers.module';
import { StockModule } from './modules/stock/stock.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SettingsModule } from './modules/settings/settings.module';
import { PermissionsManagementModule } from './modules/permissions-management/permissions-management.module';
import { ClientPortalModule } from './modules/client-portal/client-portal.module';
import { SalaryRatesModule } from './modules/salary-rates/salary-rates.module';
import { ClientReportsModule } from './modules/client-reports/client-reports.module';
import { DesignReviewsModule } from './modules/design-reviews/design-reviews.module';
import { StockApprovalsModule } from './modules/stock-approvals/stock-approvals.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EngineeringSubmissionsModule } from './modules/engineering-submissions/engineering-submissions.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const url = configService.get<string>('DATABASE_URL');
                if (url) {
                    return {
                        type: 'postgres',
                        url,
                        ssl: { rejectUnauthorized: false },
                        autoLoadEntities: true,
                        synchronize: false,
                        logging: false,
                        retryAttempts: 1,
                        retryDelay: 1000,
                        extra: { max: 1 },
                    };
                }
                return {
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', '123Rw@nd@'),
                    database: configService.get('DB_DATABASE', 'profile_db'),
                    ssl: false,
                    autoLoadEntities: true,
                    synchronize: false,
                    logging: false,
                };
            },
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        CommonModule,
        AuthModule,
        ProfileModule,
        ChatModule,
        NotificationModule,
        ResourcesModule,
        EventsModule,
        DatabaseModule,
        UploadModule,
        CacheModule,
        AuditModule,
        MlModule,
        ProjectsModule,
        SitesModule,
        DesignsModule,
        PartnershipsModule,
        EmployeesModule,
        AttendanceModule,
        PayrollModule,
        IncomesModule,
        ExpensesModule,
        ReportsModule,
        ApprovalsModule,
        ContractsModule,
        MaterialRequestsModule,
        ProjectEvidenceModule,
        SiteActivitiesModule,
        SiteRulesModule,
        EmployeeAssignmentsModule,
        SubscribersModule,
        StockModule,
        CategoriesModule,
        SettingsModule,
        PermissionsManagementModule,
        ClientPortalModule,
        SalaryRatesModule,
        ClientReportsModule,
        DesignReviewsModule,
        StockApprovalsModule,
        DashboardModule,
        EngineeringSubmissionsModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
