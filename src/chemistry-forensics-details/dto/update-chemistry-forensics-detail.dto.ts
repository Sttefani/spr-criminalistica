import { PartialType } from '@nestjs/mapped-types';
import { CreateChemistryForensicsDetailDto } from './create-chemistry-forensics-detail.dto';

export class UpdateChemistryForensicsDetailDto extends PartialType(CreateChemistryForensicsDetailDto) {}
