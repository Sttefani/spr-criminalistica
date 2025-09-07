/* eslint-disable prettier/prettier */
// Arquivo: src/exam-types/dto/create-exam-type.dto.ts

import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateExamTypeDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do tipo de exame é obrigatório.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'A sigla é obrigatória.' })
  @MaxLength(50, { message: 'A sigla pode ter no máximo 50 caracteres.' })
  acronym: string;

  @IsString()
  @IsOptional() // A descrição é opcional
  description?: string;
}