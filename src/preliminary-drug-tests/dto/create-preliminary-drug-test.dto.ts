// Arquivo: src/preliminary-drug-tests/dto/create-preliminary-drug-test.dto.ts

import { IsString, IsNotEmpty, IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreatePreliminaryDrugTestDto {
  // --- Relacionamentos (enviamos os IDs) ---

  @IsUUID(undefined, { message: 'O ID do tipo de procedimento é inválido.' })
  @IsNotEmpty({ message: 'O tipo de procedimento é obrigatório.' })
  procedureId: string;

  @IsUUID(undefined, { message: 'O ID da classificação da ocorrência é inválido.' })
  @IsNotEmpty({ message: 'A classificação da ocorrência é obrigatória.' })
  occurrenceClassificationId: string;

  @IsUUID(undefined, { message: 'O ID do perito responsável é inválido.' })
  @IsNotEmpty({ message: 'O perito responsável é obrigatório.' })
  responsibleExpertId: string;

  @IsUUID(undefined, { message: 'O ID da unidade demandante é inválido.' })
  @IsNotEmpty({ message: 'A unidade demandante é obrigatória.' })
  requestingUnitId: string;

  @IsUUID(undefined, { message: 'O ID da autoridade demandante é inválido.' })
  @IsNotEmpty({ message: 'A autoridade demandante é obrigatória.' })
  requestingAuthorityId: string;

  @IsUUID(undefined, { message: 'O ID da cidade é inválido.' })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  cityId: string;

  // --- Dados Diretos ---

  @IsString()
  @IsNotEmpty({ message: 'O número do procedimento é obrigatório.' })
  procedureNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição da substância é obrigatória.' })
  substanceDescription: string;

  @IsString()
  @IsNotEmpty({ message: 'O lacre de entrada é obrigatório.' })
  sealIn: string;

  @IsNumber({}, { message: 'O peso bruto deve ser um número.' })
  @Min(0, { message: 'O peso bruto não pode ser negativo.' })
  @IsNotEmpty({ message: 'O peso bruto é obrigatório.' })
  grossWeight: number;
  
  // --- Campos Opcionais (preenchidos depois) ---

  @IsNumber({}, { message: 'O peso da contraprova deve ser um número.' })
  @Min(0, { message: 'O peso da contraprova não pode ser negativo.' })
  @IsOptional()
  counterproofWeight?: number;

  @IsNumber({}, { message: 'O peso líquido deve ser um número.' })
  @Min(0, { message: 'O peso líquido não pode ser negativo.' })
  @IsOptional()
  netWeight?: number;

  @IsString()
@IsNotEmpty({ message: 'O lacre de saída é obrigatório.' })
  sealOut?: string;

  @IsString()
  @IsOptional()
  labSeal?: string;
}