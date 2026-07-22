import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Update } from './entities/update.entity';
import { CreateUpdateDto } from './dto/create-update.dto';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

@Injectable()
export class UpdatesService {
    constructor(
        @InjectRepository(Update)
        private repo: Repository<Update>,
    ) {}

    async create(dto: CreateUpdateDto): Promise<Update> {
        const slug = dto.slug || slugify(dto.title);
        const existing = await this.repo.findOne({ where: { slug } });
        if (existing) {
            throw new BadRequestException('An update with this title/slug already exists');
        }
        const update = this.repo.create({ ...dto, slug });
        return this.repo.save(update);
    }

    async findAll(): Promise<Update[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findPublished(): Promise<Update[]> {
        return this.repo.find({
            where: { isPublished: true },
            order: { publishedAt: 'DESC', createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Update> {
        try {
            const update = await this.repo.findOne({ where: { id } });
            if (!update) throw new NotFoundException('Update not found');
            return update;
        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException('Invalid update ID format');
        }
    }

    async findBySlug(slug: string): Promise<Update> {
        const update = await this.repo.findOne({ where: { slug } });
        if (!update) throw new NotFoundException('Update not found');
        return update;
    }

    async update(id: string, dto: Partial<CreateUpdateDto>): Promise<Update> {
        try {
            const existing = await this.findOne(id);
            if (dto.slug && dto.slug !== existing.slug) {
                const slugExists = await this.repo.findOne({ where: { slug: dto.slug } });
                if (slugExists) throw new BadRequestException('An update with this slug already exists');
            }
            if (dto.isPublished && !existing.isPublished) {
                (dto as any).publishedAt = new Date();
            }
            await this.repo.update(id, dto as any);
            return this.findOne(id);
        } catch (error: any) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
            throw new BadRequestException('Invalid update ID format');
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.repo.delete(id);
            if (result.affected === 0) throw new NotFoundException('Update not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException('Invalid update ID format');
        }
    }
}
