/* eslint-disable prettier/prettier */
import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { OccurrenceStatus } from '../enums/occurrence-status.enum';

export class FindOccurrencesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser pelo menos 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limite deve ser um número inteiro' })
  @Min(1, { message: 'Limite deve ser pelo menos 1' })
  @Max(100, { message: 'Limite deve ser no máximo 100' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'Busca deve conter uma chamada' })
  search?: string;

  @IsOptional()
  @IsEnum(OccurrenceStatus, { message: 'Status deve ser um valor válido' })
  status?: OccurrenceStatus;

  @IsOptional()
  @IsString({ message: 'ID da cidade deve ser uma string' })
  cityId?: string;
}