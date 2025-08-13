// Arquivo: src/computer-forensics-details/dto/create-computer-forensics-detail.dto.ts

// Arquivo: src/computer-forensics-details/dto/create-computer-forensics-detail.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateComputerForensicsDetailDto {
  @IsUUID('4', { message: 'O ID da ocorrência deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID da ocorrência é obrigatório.' })
  occurrenceId: string;

  @IsArray({ message: 'Descreva a lista de objetos.' })
  @IsNotEmpty({ message: 'A lista é obrigatória.' })
  equipment: any[];

  @IsString({ message: 'As observações gerais devem ser um texto.' })
  @IsOptional()
  generalObservations?: string;

  // Lista opcional de IDs (UUIDs) dos ExamTypes a serem realizados
  @IsArray({ message: 'APonte os exames que serão usados nessa perícia.' })
  @IsUUID('4', { each: true, message: 'Cada ID de exame deve ser um UUID válido.' })
  @IsOptional()
  examTypeIds?: string[];
}