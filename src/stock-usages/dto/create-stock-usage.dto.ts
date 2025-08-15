// Arquivo: src/stock-usages/dto/create-stock-usage.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateStockUsageDto {
  @IsUUID('4', { message: 'O ID do item de estoque é inválido.' })
  @IsNotEmpty({ message: 'O item de estoque é obrigatório.' })
  stockItemId: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'A quantidade utilizada deve ser um número com até 2 casas decimais.' })
  @IsPositive({ message: 'A quantidade utilizada deve ser um número positivo.' })
  @IsNotEmpty({ message: 'A quantidade utilizada é obrigatória.' })
  quantityUsed: number;

  @IsDateString({}, { message: 'A data de uso deve estar no formato ISO 8601.' })
  @IsNotEmpty({ message: 'A data de uso é obrigatória.' })
  usageDate: Date;
  
  // ID opcional da ocorrência onde o item foi usado
  @IsUUID('4', { message: 'O ID da ocorrência relacionada é inválido.' })
  @IsOptional()
  relatedOccurrenceId?: string;
}