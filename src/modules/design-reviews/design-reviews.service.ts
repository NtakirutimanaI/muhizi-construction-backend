import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DesignReview } from './entities/design-review.entity';
import { CreateDesignReviewDto, UpdateDesignReviewDto } from './dto/create-design-review.dto';

@Injectable()
export class DesignReviewsService {
    constructor(
        @InjectRepository(DesignReview)
        private repo: Repository<DesignReview>,
    ) {}

    async findAll() {
        return this.repo.find({ relations: ['design', 'reviewer'], order: { createdAt: 'DESC' } });
    }

    async findByDesign(designId: string) {
        return this.repo.find({
            where: { designId },
            relations: ['reviewer'],
            order: { submittedAt: 'DESC' },
        });
    }

    async findOne(id: string) {
        const review = await this.repo.findOne({ where: { id }, relations: ['design', 'reviewer'] });
        if (!review) throw new NotFoundException('Design review not found');
        return review;
    }

    async create(dto: CreateDesignReviewDto, reviewerId: string) {
        return this.repo.save(this.repo.create({ ...dto, reviewerId }));
    }

    async update(id: string, dto: UpdateDesignReviewDto) {
        const review = await this.findOne(id);
        Object.assign(review, dto, { reviewedAt: new Date() });
        return this.repo.save(review);
    }

    async remove(id: string) {
        const review = await this.findOne(id);
        return this.repo.remove(review);
    }
}
