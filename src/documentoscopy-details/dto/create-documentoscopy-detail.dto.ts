// Arquivo: src/documentoscopy-details/dto/create-documentoscopy-detail.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  ArrayMinSize,
  IsObject,
} from 'class-validator';

export class CreateDocumentoscopyDetailDto {
  @IsUUID('4', { message: 'O ID da ocorrência deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'É obrigatório associar estes detalhes a uma ocorrência.' })
  occurrenceId: string;

  @IsArray({ message: 'A lista de itens questionados deve ser fornecida.' })
  @IsNotEmpty({ message: 'É obrigatório informar os itens questionados.' })
  questionedItems: any[];

  // Lista OBRIGATÓRIA de IDs dos ExamTypes a serem realizados
  @IsArray({ message: 'A lista de exames selecionados é inválida.' })
  @IsUUID('4', { each: true, message: 'Cada exame selecionado deve ser válido.' })
  @ArrayMinSize(1, { message: 'É obrigatório selecionar pelo menos um tipo de exame.' }) // <-- REGRA DE OBRIGATORIEDADE
  examTypeIds: string[];

  @IsString({ message: 'As observações gerais devem ser um texto.' })
  @IsOptional()
  generalObservations?: string;

  @IsObject({ message: 'Os campos adicionais não são obrigatórios.' })
  @IsOptional()
  additionalFields?: any;
}
