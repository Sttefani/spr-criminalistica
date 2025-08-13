import { PartialType } from '@nestjs/mapped-types';
import { CreateCrimeAgainstPersonDetailDto } from './create-crime-against-person-detail.dto';

export class UpdateCrimeAgainstPersonDetailDto extends PartialType(CreateCrimeAgainstPersonDetailDto) {}
