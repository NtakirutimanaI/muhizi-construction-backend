import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Site } from '../sites/entities/site.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private repo: Repository<Attendance>,
        @InjectRepository(Site)
        private siteRepo: Repository<Site>,
    ) { }

    private async assignedProjectIds(engineerId: string): Promise<string[]> {
        const sites = await this.siteRepo.find({ where: { assignedEngineerId: engineerId } });
        return [...new Set(sites.map(s => s.projectId).filter((id): id is string => !!id))];
    }

    private async assertProjectAssigned(engineerId: string, projectId?: string): Promise<void> {
        if (!projectId) throw new ForbiddenException('A project is required');
        const projectIds = await this.assignedProjectIds(engineerId);
        if (!projectIds.includes(projectId)) throw new ForbiddenException('You are not assigned to this project');
    }

    async create(dto: CreateAttendanceDto, engineerId?: string): Promise<Attendance> {
        if (engineerId) await this.assertProjectAssigned(engineerId, dto.projectId);
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

    async findAll(engineerId?: string): Promise<Attendance[]> {
        if (engineerId) {
            const projectIds = await this.assignedProjectIds(engineerId);
            if (projectIds.length === 0) return [];
            return this.repo.find({
                where: { projectId: In(projectIds) },
                order: { date: 'DESC', checkIn: 'DESC' },
                relations: ['employee', 'project'],
            });
        }
        return this.repo.find({
            order: { date: 'DESC', checkIn: 'DESC' },
            relations: ['employee', 'project'],
        });
    }

    async findOne(id: string, engineerId?: string): Promise<Attendance> {
        const attendance = await this.repo.findOne({ where: { id }, relations: ['employee', 'project'] });
        if (!attendance) throw new NotFoundException('Attendance record not found');
        if (engineerId) {
            const projectIds = await this.assignedProjectIds(engineerId);
            if (!attendance.projectId || !projectIds.includes(attendance.projectId)) {
                throw new NotFoundException('Attendance record not found');
            }
        }
        return attendance;
    }

    async findByDateRange(start: string, end: string, engineerId?: string): Promise<Attendance[]> {
        if (engineerId) {
            const projectIds = await this.assignedProjectIds(engineerId);
            if (projectIds.length === 0) return [];
            return this.repo.find({
                where: { date: Between(start, end), projectId: In(projectIds) },
                order: { date: 'DESC' },
                relations: ['employee', 'project'],
            });
        }
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

    async findByProject(projectId: string, engineerId?: string): Promise<Attendance[]> {
        if (engineerId) await this.assertProjectAssigned(engineerId, projectId);
        return this.repo.find({
            where: { projectId },
            order: { date: 'DESC', checkIn: 'DESC' },
            relations: ['employee', 'project'],
        });
    }

    async findBySite(site: string, engineerId?: string): Promise<Attendance[]> {
        if (engineerId) {
            const siteRecord = await this.siteRepo.findOne({ where: { name: site } });
            if (!siteRecord || siteRecord.assignedEngineerId !== engineerId) return [];
        }
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

    async update(id: string, dto: Partial<CreateAttendanceDto>, engineerId?: string): Promise<Attendance> {
        if (engineerId) {
            const existing = await this.findOne(id, engineerId);
            await this.assertProjectAssigned(engineerId, dto.projectId || existing.projectId);
        }
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Attendance record not found');
    }

    async getStats(engineerId?: string): Promise<any> {
        const today = new Date().toISOString().split('T')[0];
        const allToday = engineerId
            ? await (async () => {
                const projectIds = await this.assignedProjectIds(engineerId);
                if (projectIds.length === 0) return [];
                return this.repo.find({ where: { date: today, projectId: In(projectIds) }, relations: ['project'] });
            })()
            : await this.repo.find({
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
