/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { OccurrenceStatus } from '../enums/occurrence-status.enum';
import { CreateGeneralOccurrenceDto } from './create-general-occurrence.dto';

export class UpdateGeneralOccurrenceDto extends PartialType(CreateGeneralOccurrenceDto) {
  @IsOptional()
  @IsEnum(OccurrenceStatus, { message: 'Status deve ser um valor válido' })
  status?: OccurrenceStatus;
}
