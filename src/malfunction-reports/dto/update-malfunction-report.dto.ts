// Arquivo: src/malfunction-reports/dto/update-malfunction-report.dto.ts

import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMalfunctionReportDto } from './create-malfunction-report.dto';
import { ReportStatus } from '../enums/report-status.enum';

export class UpdateMalfunctionReportDto extends PartialType(
  CreateMalfunctionReportDto,
) {
  @IsEnum(ReportStatus, { message: 'O status informado é inválido.' })
  @IsOptional()
  status?: ReportStatus;

  @IsUUID('4', { message: 'O ID da manutenção relacionada é inválido.' })
  @IsOptional()
  relatedMaintenanceId?: string;
}