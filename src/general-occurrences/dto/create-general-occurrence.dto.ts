// Arquivo: src/general-occurrences/dto/create-general-occurrence.dto.ts

import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional, IsObject } from 'class-validator';

export class CreateGeneralOccurrenceDto {
  // --- Relacionamentos Obrigatórios ---
  @IsUUID(undefined, { message: 'O ID do serviço pericial é inválido.' })
  @IsNotEmpty({ message: 'O serviço pericial é obrigatório.' })
  forensicServiceId: string;

  @IsUUID(undefined, { message: 'O ID da cidade é inválido.' })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  cityId: string;

  // --- Relacionamentos Opcionais ---
  @IsUUID(undefined, { message: 'O ID do procedimento é inválido.' })
  @IsOptional()
  procedureId?: string;

  @IsUUID(undefined, { message: 'O ID da unidade demandante é inválido.' })
  @IsOptional()
  requestingUnitId?: string;

  @IsUUID(undefined, { message: 'O ID da autoridade demandante é inválido.' })
  @IsOptional()
  requestingAuthorityId?: string;

  @IsUUID(undefined, { message: 'O ID do perito responsável é inválido.' })
  @IsOptional()
  responsibleExpertId?: string;

  // --- Dados Diretos ---
  @IsString()
  @IsOptional()
  procedureNumber?: string;

  @IsDateString({}, { message: 'A data da ocorrência deve estar no formato ISO 8601.' })
  @IsNotEmpty({ message: 'A data da ocorrência é obrigatória.' })
  occurrenceDate: Date;

  @IsString()
  @IsNotEmpty({ message: 'O histórico é obrigatório.' })
  history: string;

  @IsObject()
  @IsOptional()
  additionalFields?: any;
}