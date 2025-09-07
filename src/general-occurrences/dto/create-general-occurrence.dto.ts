/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsDateString, IsObject, IsArray } from 'class-validator';

export class CreateGeneralOccurrenceDto {
  @IsDateString({}, { message: 'A data da ocorrência deve estar em um formato de data válido.' })
  @IsNotEmpty({ message: 'A data da ocorrência é obrigatória.' })
  occurrenceDate: Date;

  @IsString({ message: 'O histórico deve ser um texto.' })
  @IsNotEmpty({ message: 'O histórico é obrigatório.' })
  history: string;

  @IsUUID('4', { message: 'O Serviço Pericial deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O Serviço Pericial é obrigatório.' })
  forensicServiceId: string;

  @IsUUID('4', { message: 'A Cidade deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'A Cidade é obrigatória.' })
  cityId: string;
  
  @IsUUID('4', { message: 'A Classificação da Ocorrência deve ser um UUID válido.' })
  @IsOptional()
  occurrenceClassificationId?: string;

  @IsUUID('4', { message: 'O Procedimento deve ser um UUID válido.' })
  @IsOptional()
  procedureId?: string;

  @IsString({ message: 'O número do procedimento deve ser um texto.' })
  @IsOptional()
  procedureNumber?: string;

  @IsUUID('4', { message: 'O Perito Responsável deve ser um código válido.' })
  @IsOptional()
  responsibleExpertId?: string;

  @IsUUID('4', { message: 'A Unidade Demandante deve ser um código válido.' })
  @IsOptional()
  requestingUnitId?: string;

  @IsUUID('4', { message: 'A Autoridade Requisitante deve ser um código válido.' })
  @IsOptional()
  requestingAuthorityId?: string;

  @IsArray({ message: 'Os tipos de exame devem ser uma lista.' })
  @IsUUID('4', { each: true, message: 'Cada tipo de exame deve ser um UUID válido.' })
  @IsOptional()
  examTypeIds?: string[];

  @IsObject({ message: 'Os campos adicionais devem ser um objeto.' })
  @IsOptional()
  additionalFields?: any;
}