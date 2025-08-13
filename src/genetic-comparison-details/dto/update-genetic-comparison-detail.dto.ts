import { PartialType } from '@nestjs/mapped-types';
import { CreateGeneticComparisonDetailDto } from './create-genetic-comparison-detail.dto';

export class UpdateGeneticComparisonDetailDto extends PartialType(CreateGeneticComparisonDetailDto) {}
