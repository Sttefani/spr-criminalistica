// Arquivo: src/procedures/dto/create-procedure.dto.ts

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProcedureDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do procedimento é obrigatório.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A sigla do procedimento é obrigatória.' })
  @MaxLength(50, { message: 'A sigla pode ter no máximo 50 caracteres.' })
  acronym: string;
}