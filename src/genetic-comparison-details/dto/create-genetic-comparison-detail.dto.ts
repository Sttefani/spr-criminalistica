// Arquivo: src/genetic-comparison-details/dto/create-genetic-comparison-detail.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsObject,
} from 'class-validator';

export class CreateGeneticComparisonDetailDto {
  @IsUUID('4', { message: 'O ID da ocorrência deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID da ocorrência é obrigatório.' })
  occurrenceId: string;

  @IsArray({ message: 'As amostras devem ser uma lista.' })
  @IsNotEmpty({ message: 'A lista de amostras é obrigatória.' })
  samples: any[];

  @IsString({ message: 'O objetivo da comparação deve ser um texto.' })
  @IsOptional()
  comparisonObjective?: string;

  // Lista opcional de IDs (UUIDs) dos ExamTypes a serem realizados
  @IsArray({ message: 'A lista de exames deve ser um array.' })
  @IsUUID('4', { each: true, message: 'Cada ID de exame deve ser um UUID válido.' })
  @IsOptional()
  examTypeIds?: string[];

  @IsObject({ message: 'Os campos adicionais devem ser um objeto.' })
  @IsOptional()
  additionalFields?: any;
}
