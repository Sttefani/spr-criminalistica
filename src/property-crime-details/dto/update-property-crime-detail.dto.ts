import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyCrimeDetailDto } from './create-property-crime-detail.dto';

export class UpdatePropertyCrimeDetailDto extends PartialType(CreatePropertyCrimeDetailDto) {}
