import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private repo: Repository<Attendance>,
    ) { }

    async create(dto: CreateAttendanceDto): Promise<Attendance> {
        try {
            const attendance = this.repo.create(dto);
            const saved = await this.repo.save(attendance);
            return saved;
        } catch (error: any) {
            console.error('=== ATTENDANCE CREATE ERROR ===', error?.code, error?.message);
            if (error?.message?.includes('violates foreign key') || error?.code === '23503') {
                throw new BadRequestException('Referenced employee or project not found');
            }
            throw new BadRequestException('Invalid attendance data: ' + (error?.message || 'unknown error'));
        }
    }

    async findAll(): Promise<Attendance[]> {
        return this.repo.find({
            order: { date: 'DESC', checkIn: 'DESC' },
            relations: ['employee', 'project'],
        });
    }

    async findOne(id: string): Promise<Attendance> {
        const attendance = await this.repo.findOne({ where: { id }, relations: ['employee', 'project'] });
        if (!attendance) throw new NotFoundException('Attendance record not found');
        return attendance;
    }

    async findByDateRange(start: string, end: string): Promise<Attendance[]> {
        return this.repo.find({
            where: { date: Between(start, end) },
            order: { date: 'DESC' },
            relations: ['employee', 'project'],
        });
    }

    async findByEmployee(employeeId: string): Promise<Attendance[]> {
        return this.repo.find({
            where: { employeeId },
            order: { date: 'DESC' },
            relations: ['project'],
        });
    }

    async findByProject(projectId: string): Promise<Attendance[]> {
        return this.repo.find({
            where: { projectId },
            order: { date: 'DESC', checkIn: 'DESC' },
            relations: ['employee', 'project'],
        });
    }

    async findBySite(site: string): Promise<Attendance[]> {
        return this.repo.find({
            where: { site },
            order: { date: 'DESC', checkIn: 'DESC' },
            relations: ['employee', 'project'],
        });
    }

    async findByEmployeeInMonth(employeeId: string, year: number, month: number): Promise<Attendance[]> {
        const now = new Date();
        const y = year || now.getFullYear();
        const m = month || (now.getMonth() + 1);
        if (m < 1 || m > 12) {
            throw new BadRequestException('Month must be between 1 and 12');
        }
        const start = `${y}-${String(m).padStart(2, '0')}-01`;
        const lastDay = new Date(y, m, 0).getDate();
        const end = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        return this.repo.find({
            where: { employeeId, date: Between(start, end) },
            order: { date: 'ASC' },
            relations: ['project'],
        });
    }

    async update(id: string, dto: Partial<CreateAttendanceDto>): Promise<Attendance> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Attendance record not found');
    }

    async getStats(): Promise<any> {
        const today = new Date().toISOString().split('T')[0];
        const allToday = await this.repo.find({
            where: { date: today },
            relations: ['project'],
        });
        return {
            total: allToday.length,
            present: allToday.filter(a => a.status === 'present').length,
            absent: allToday.filter(a => a.status === 'absent').length,
            late: allToday.filter(a => a.status === 'late').length,
            halfDay: allToday.filter(a => a.status === 'half_day').length,
            onLeave: allToday.filter(a => a.status === 'on_leave').length,
            permission: allToday.filter(a => a.status === 'permission').length,
            suspended: allToday.filter(a => a.status === 'suspended').length,
        };
    }
}
