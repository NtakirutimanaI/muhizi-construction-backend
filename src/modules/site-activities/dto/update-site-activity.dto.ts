import { PartialType } from '@nestjs/swagger';
import { CreateSiteActivityDto } from './create-site-activity.dto';

export class UpdateSiteActivityDto extends PartialType(CreateSiteActivityDto) {}
