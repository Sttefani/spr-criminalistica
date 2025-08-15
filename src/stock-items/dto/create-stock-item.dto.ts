// Arquivo: src/stock-items/dto/create-stock-item.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockItemDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do item é obrigatório.' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória.' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'A unidade de medida é obrigatória.' })
  unitOfMeasure: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'A margem de segurança deve ser um número decimal.' })
  @Min(0, { message: 'A margem de segurança não pode ser negativa.' })
  @Max(1, { message: 'A margem de segurança deve ser entre 0 (0%) e 1 (100%).' })
  @IsOptional()
  @Type(() => Number) // Garante a conversão correta de string para número
  safetyMargin?: number;

  @IsObject()
  @IsOptional()
  additionalFields?: any;
}