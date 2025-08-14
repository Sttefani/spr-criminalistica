// Arquivo: src/chemistry-forensics-details/dto/create-chemistry-forensics-detail.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsObject,
} from 'class-validator';

export class CreateChemistryForensicsDetailDto {
  @IsUUID('4', { message: 'O ID da ocorrência fornecido é inválido.' })
  @IsNotEmpty({ message: 'É obrigatório associar estes detalhes a uma ocorrência.' })
  occurrenceId: string;

  @IsArray({ message: 'A lista de vestígios deve ser fornecida.' })
  @IsNotEmpty({ message: 'É obrigatório informar os vestígios coletados.' })
  vestiges: any[];

  @IsString({ message: 'As observações gerais devem ser um texto.' })
  @IsOptional()
  generalObservations?: string;

  // Lista opcional de IDs dos exames a serem realizados
  @IsArray({ message: 'A lista de exames é facultativa mas precisa ser válida.'})
  @IsUUID('4', { each: true, message: 'Cada exame selecionado deve ser válido.' })
  @IsOptional()
  examTypeIds?: string[];

  @IsObject({ message: 'Os campos adicionais devem ser um objeto.' })
  @IsOptional()
  additionalFields?: any;
}