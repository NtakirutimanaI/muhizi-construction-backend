import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteRule } from './entities/site-rule.entity';
import { SiteRulesController } from './site-rules.controller';
import { SiteRulesService } from './site-rules.service';

@Module({
    imports: [TypeOrmModule.forFeature([SiteRule])],
    controllers: [SiteRulesController],
    providers: [SiteRulesService],
})
export class SiteRulesModule {}
