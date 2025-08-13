// Arquivo: src/ballistics-details/dto/create-ballistics-detail.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateBallisticsDetailDto {
  @IsUUID('4', { message: 'O ID da ocorrência deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'É obrigatório associar estes detalhes a uma ocorrência.' })
  occurrenceId: string;

  @IsArray({ message: 'A lista de itens deve ser fornecida.' })
  @IsNotEmpty({ message: 'É obrigatório informar os itens recebidos para a perícia.' })
  items: any[];

  @IsString({ message: 'O registro SINAB deve ser um texto.' })
  @IsOptional()
  sinabRegistration?: string;

  // Lista opcional de IDs (UUIDs) dos ExamTypes a serem realizados
  @IsArray({ message: 'A lista de exames selecionados é inválida.' })
  @IsUUID('4', { each: true, message: 'Cada exame selecionado deve ser válido.' })
  @IsOptional()
  examTypeIds?: string[];

  @IsString({ message: 'As observações gerais devem ser um texto.' })
  @IsOptional()
  generalObservations?: string;
}