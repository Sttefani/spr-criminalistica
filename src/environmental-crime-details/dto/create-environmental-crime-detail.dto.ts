// Arquivo: src/environmental-crime-details/dto/create-environmental-crime-detail.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsObject,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { DamageType } from '../enums/damage-type.enum';

export class CreateEnvironmentalCrimeDetailDto {
  @IsUUID('4', { message: 'O ID da ocorrência deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'É obrigatório associar estes detalhes a uma ocorrência.' })
  occurrenceId: string;

  @IsString({ message: 'A descrição da área deve ser um texto.' })
  @IsNotEmpty({ message: 'A descrição da área é obrigatória.' })
  areaDescription: string;

  @IsEnum(DamageType, { message: 'O tipo de dano principal informado é inválido.' })
  @IsOptional()
  mainDamageType?: DamageType;

  @IsBoolean({ message: 'O campo de área extensa deve ser SIM OU NÃO.' })
  @IsOptional()
  isAreaExtensive?: boolean;

  @IsArray({ message: 'A lista de pontos de interesse é inválida.' })
  @IsOptional()
  pointsOfInterest?: any[];

  @IsArray({ message: 'A lista de exames selecionados é inválida.' })
  @IsUUID('4', { each: true, message: 'Cada exame selecionado deve ser válido.' })
  @IsOptional()
  examTypeIds?: string[];

  @IsObject({ message: 'Os campos adicionais são opcionais.' })
  @IsOptional()
  additionalFields?: any;
}