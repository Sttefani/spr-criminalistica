// Arquivo: src/stock-entries/dto/create-stock-entry.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateStockEntryDto {
  @IsUUID('4', { message: 'O ID do item de estoque é inválido.' })
  @IsNotEmpty({ message: 'O item de estoque é obrigatório.' })
  stockItemId: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'A quantidade deve ser um número com até 2 casas decimais.' })
  @IsPositive({ message: 'A quantidade deve ser um número positivo.' })
  @IsNotEmpty({ message: 'A quantidade é obrigatória.' })
  quantity: number;

  @IsString()
  @IsOptional()
  lotNumber?: string;

  @IsDateString({}, { message: 'A data de validade deve estar no formato ISO 8601 (YYYY-MM-DD).' })
  @IsOptional()
  expirationDate?: Date;

  @IsDateString({}, { message: 'A data de entrada deve estar no formato ISO 8601.' })
  @IsNotEmpty({ message: 'A data de entrada é obrigatória.' })
  entryDate: Date;
}