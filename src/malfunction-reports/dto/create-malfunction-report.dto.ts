// Arquivo: src/malfunction-reports/dto/create-malfunction-report.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateMalfunctionReportDto {
  @IsUUID('4', { message: 'O ID da viatura é inválido.' })
  @IsNotEmpty({ message: 'A viatura é obrigatória.' })
  vehicleId: string;

  @IsDateString({}, { message: 'A data do registro deve estar no formato ISO 8601.' })
  @IsNotEmpty({ message: 'A data do registro é obrigatória.' })
  reportDate: Date;

  @IsString()
  @IsNotEmpty({ message: 'A descrição do problema é obrigatória.' })
  description: string;
}