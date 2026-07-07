import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from './entities/system-setting.entity';
import { CreateSettingDto, UpdateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(SystemSetting)
        private repo: Repository<SystemSetting>,
    ) {}

    async findAll(category?: string) {
        const where = category ? { category } : {};
        return this.repo.find({ where, order: { key: 'ASC' } });
    }

    async findByKey(key: string) {
        const setting = await this.repo.findOne({ where: { key } });
        if (!setting) throw new NotFoundException(`Setting "${key}" not found`);
        return setting;
    }

    async create(dto: CreateSettingDto) {
        return this.repo.save(this.repo.create(dto));
    }

    async update(key: string, dto: UpdateSettingDto) {
        const setting = await this.findByKey(key);
        Object.assign(setting, dto);
        return this.repo.save(setting);
    }

    async backup() {
        const settings = await this.repo.find();
        return {
            success: true,
            message: 'Backup completed',
            data: settings,
            timestamp: new Date().toISOString(),
        };
    }

    async restore(data: any[]) {
        await this.repo.clear();
        for (const item of data) {
            await this.repo.save(this.repo.create(item));
        }
        return { success: true, message: 'Restore completed' };
    }
}
