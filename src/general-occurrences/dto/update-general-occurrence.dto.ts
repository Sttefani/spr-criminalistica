// Arquivo: src/general-occurrences/dto/update-general-occurrence.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateGeneralOccurrenceDto } from './create-general-occurrence.dto';

export class UpdateGeneralOccurrenceDto extends PartialType(
  CreateGeneralOccurrenceDto,
) {}