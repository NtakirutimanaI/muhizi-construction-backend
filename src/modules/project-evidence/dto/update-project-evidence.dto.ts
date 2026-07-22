import { PartialType } from '@nestjs/swagger';
import { CreateProjectEvidenceDto } from './create-project-evidence.dto';

export class UpdateProjectEvidenceDto extends PartialType(CreateProjectEvidenceDto) {}
