import { Injectable, NotFoundException } from '@nestjs/common';
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
        const attendance = this.repo.create(dto);
        return this.repo.save(attendance);
    }

    async findAll(): Promise<Attendance[]> {
        return this.repo.find({
            order: { date: 'DESC', checkIn: 'DESC' },
            relations: ['employee'],
        });
    }

    async findOne(id: string): Promise<Attendance> {
        const attendance = await this.repo.findOne({ where: { id }, relations: ['employee'] });
        if (!attendance) throw new NotFoundException('Attendance record not found');
        return attendance;
    }

    async findByDateRange(start: string, end: string): Promise<Attendance[]> {
        return this.repo.find({
            where: { date: Between(start, end) },
            order: { date: 'DESC' },
            relations: ['employee'],
        });
    }

    async findByEmployee(employeeId: string): Promise<Attendance[]> {
        return this.repo.find({
            where: { employeeId },
            order: { date: 'DESC' },
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
        const allToday = await this.repo.find({ where: { date: today } });
        return {
            total: allToday.length,
            present: allToday.filter(a => a.status === 'present').length,
            absent: allToday.filter(a => a.status === 'absent').length,
            late: allToday.filter(a => a.status === 'late').length,
            halfDay: allToday.filter(a => a.status === 'half_day').length,
            onLeave: allToday.filter(a => a.status === 'on_leave').length,
        };
    }
}
