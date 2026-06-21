import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeAssignment } from './entities/employee-assignment.entity';
import { EmployeeAssignmentsController } from './employee-assignments.controller';
import { EmployeeAssignmentsService } from './employee-assignments.service';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeAssignment])],
    controllers: [EmployeeAssignmentsController],
    providers: [EmployeeAssignmentsService],
    exports: [EmployeeAssignmentsService],
})
export class EmployeeAssignmentsModule { }
