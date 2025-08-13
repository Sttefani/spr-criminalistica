// Arquivo: src/crime-against-person-details/dto/create-crime-against-person-detail.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from 'src/common/dto/address.dto';

export class CreateCrimeAgainstPersonDetailDto {
  @IsUUID('4', { message: 'O ID da ocorrência deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID da ocorrência é obrigatório.' })
  occurrenceId: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsArray({ message: 'Descreva detalhadamente sobre a identificação da vítima.' })
  @IsOptional()
  victimDetails?: any[];

  @IsString({ message: 'Descreve detalhes do objeto relacionado à pratica delitiva.' })
  @IsOptional()
  crimeWeapon?: string;

  @IsArray({ message: 'Descreva as evidências coletadas, inclusive lacres se possível.' })
  @IsOptional()
  evidenceCollected?: any[];

  @IsString({ message: 'Informações julgadas úteis para o fato.' })
  @IsOptional()
  sceneDescription?: string;
}