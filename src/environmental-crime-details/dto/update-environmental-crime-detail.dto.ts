import { PartialType } from '@nestjs/mapped-types';
import { CreateEnvironmentalCrimeDetailDto } from './create-environmental-crime-detail.dto';

export class UpdateEnvironmentalCrimeDetailDto extends PartialType(CreateEnvironmentalCrimeDetailDto) {}
