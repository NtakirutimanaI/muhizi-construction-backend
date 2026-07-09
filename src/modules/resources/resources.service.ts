import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { CreateResourceDto } from './dto/create-resource.dto';

@Injectable()
export class ResourcesService {
    constructor(
        @InjectRepository(Resource)
        private repo: Repository<Resource>
    ) { }

    create(dto: CreateResourceDto) {
        const res = this.repo.create(dto);
        return this.repo.save(res);
    }

    findAll() {
        return this.repo.find({
            order: { createdAt: 'DESC' }
        });
    }

    async update(id: string, dto: CreateResourceDto) {
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }

    async remove(id: string) {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Resource not found');
    }
}
