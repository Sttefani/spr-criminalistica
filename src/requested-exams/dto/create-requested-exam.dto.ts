import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateRequestedExamDto {
  @IsUUID(undefined, { message: 'O ID da ocorrência é inválido.' })
  @IsNotEmpty({ message: 'O ID da ocorrência é obrigatório.' })
  occurrenceId: string;

  @IsUUID(undefined, { message: 'O ID do tipo de exame é inválido.' })
  @IsNotEmpty({ message: 'O tipo de exame é obrigatório.' })
  examTypeId: string;
  
  // O perito específico para este exame é opcional na criação
  @IsUUID(undefined, { message: 'O ID do perito designado é inválido.' })
  @IsOptional()
  assignedExpertId?: string;
}