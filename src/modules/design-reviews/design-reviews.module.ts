import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignReviewsController } from './design-reviews.controller';
import { DesignReviewsService } from './design-reviews.service';
import { DesignReview } from './entities/design-review.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DesignReview])],
    controllers: [DesignReviewsController],
    providers: [DesignReviewsService],
    exports: [DesignReviewsService],
})
export class DesignReviewsModule {}
