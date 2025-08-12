import { PartialType } from '@nestjs/mapped-types';
import { CreateOccurrenceClassificationDto } from './create-occurrence-classification.dto';

export class UpdateOccurrenceClassificationDto extends PartialType(
  CreateOccurrenceClassificationDto,
) {}