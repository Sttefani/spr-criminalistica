// Arquivo: src/definitive-drug-tests/dto/create-definitive-drug-test.dto.ts

import { IsString, IsNotEmpty, IsUUID, IsArray, IsOptional } from 'class-validator';

export class CreateDefinitiveDrugTestDto {
  // O ID do Exame Preliminar que é o "pai" deste registro.
  @IsUUID(undefined, { message: 'O ID do exame preliminar é inválido.' })
  @IsNotEmpty({ message: 'O ID do exame preliminar é obrigatório.' })
  preliminaryTestId: string;

  // O perito do laboratório que está assumindo este exame.
  // No fluxo de 'reivindicação', este ID viria do usuário logado,
  // mas o DTO pode recebê-lo para flexibilidade.
  @IsUUID(undefined, { message: 'O ID do perito é inválido.' })
  @IsNotEmpty({ message: 'O perito é obrigatório.' })
  expertId: string;

  // O campo principal que o perito do laboratório preenche.
  @IsString()
  @IsNotEmpty({ message: 'O resultado da análise é obrigatório.' })
  analysisResult: string;

  @IsArray()
  @IsUUID('all', { each: true, message: 'Cada técnica deve ser um UUID válido.' }) // 'each: true' valida cada item do array
  @IsOptional()
  techniqueIds?: string[];

}