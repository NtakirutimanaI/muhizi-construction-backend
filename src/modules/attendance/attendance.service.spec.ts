import { BadRequestException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

describe('AttendanceService', () => {
    let service: AttendanceService;
    let repo: any;
    let siteRepo: any;

    beforeEach(() => {
        repo = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
        };
        siteRepo = {
            find: jest.fn(),
        };
        service = new AttendanceService(repo, siteRepo);
    });

    it('rejects creating a duplicate attendance for the same employee and date', async () => {
        const dto = {
            employeeId: 'employee-1',
            date: '2026-07-25',
            projectId: 'project-1',
            status: 'present',
        };

        repo.findOne.mockResolvedValue({ id: 'existing-record' });

        await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
        expect(repo.save).not.toHaveBeenCalled();
    });
});
