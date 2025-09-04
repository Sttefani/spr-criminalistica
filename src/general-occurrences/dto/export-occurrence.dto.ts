/* eslint-disable prettier/prettier */
import { IsOptional, IsDateString, IsEnum, IsUUID } from 'class-validator';
import { OccurrenceStatus } from '../enums/occurrence-status.enum';

export class ExportOccurrencesDto {
  @IsOptional()
  @IsDateString({}, { message: 'Data de início deve estar em formato válido' })
  startDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'Data de fim deve estar em formato válido' })
  endDate?: Date;

  @IsOptional()
  @IsEnum(OccurrenceStatus, { message: 'Status deve ser um valor válido' })
  status?: OccurrenceStatus;


  @IsOptional()
  @IsUUID('4', { message: 'ID da cidade deve ser um UUID válido' })
  cityId?: string;
}