import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const BUILTIN_CATEGORIES = [
    { value: 'construction_materials', label: 'Construction Materials' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'tools', label: 'Tools' },
    { value: 'safety_gear', label: 'Safety Gear' },
    { value: 'office_supplies', label: 'Office Supplies' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'vehicle_parts', label: 'Vehicle Parts' },
    { value: 'other', label: 'Other' },
];

@Injectable()
export class CategoriesService implements OnModuleInit {
    constructor(
        @InjectRepository(Category)
        private repo: Repository<Category>,
        @InjectDataSource() private dataSource: DataSource,
    ) { }

    async onModuleInit() {
        try {
            await this.dataSource.query(`
                CREATE TABLE IF NOT EXISTS categories (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    value VARCHAR(100) NOT NULL UNIQUE,
                    label VARCHAR(200) NOT NULL,
                    "isBuiltin" BOOLEAN NOT NULL DEFAULT false,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
                )
            `);
        } catch { }
        try {
            const count = await this.repo.count({ where: { isBuiltin: true } });
            if (count === 0) {
                await this.repo.save(
                    BUILTIN_CATEGORIES.map(c => this.repo.create({ ...c, isBuiltin: true }))
                );
            }
        } catch { }
    }

    async findAll(): Promise<Category[]> {
        return this.repo.find({ order: { isBuiltin: 'DESC', label: 'ASC' } });
    }

    async findOne(id: string): Promise<Category> {
        const cat = await this.repo.findOne({ where: { id } });
        if (!cat) throw new NotFoundException('Category not found');
        return cat;
    }

    async create(dto: CreateCategoryDto): Promise<Category> {
        const value = dto.value.toLowerCase().replace(/\s+/g, '_');
        const existing = await this.repo.findOne({ where: { value } });
        if (existing) throw new ConflictException('Category already exists');
        const entity = this.repo.create({
            value,
            label: dto.label || value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            isBuiltin: dto.isBuiltin || false,
        });
        return this.repo.save(entity);
    }

    async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        const cat = await this.findOne(id);
        if (cat.isBuiltin) throw new ConflictException('Cannot modify built-in category');
        if (dto.value) {
            dto.value = dto.value.toLowerCase().replace(/\s+/g, '_');
            const existing = await this.repo.findOne({ where: { value: dto.value } });
            if (existing && existing.id !== id) throw new ConflictException('Category already exists');
        }
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const cat = await this.findOne(id);
        if (cat.isBuiltin) throw new ConflictException('Cannot delete built-in category');
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Category not found');
    }
}
