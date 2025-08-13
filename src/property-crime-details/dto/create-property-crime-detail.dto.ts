// Arquivo: src/property-crime-details/dto/create-property-crime-detail.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from 'src/common/dto/address.dto';

export class CreatePropertyCrimeDetailDto {
  @IsUUID('4', { message: 'O ID da ocorrência deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID da ocorrência é obrigatório.' })
  occurrenceId: string;

  @IsString({ message: 'A descrição da ocorrência deve ser um texto.' })
  @IsOptional()
  entryMethod?: string;

  @IsArray({ message: 'Os itens furtados devem ser uma lista.' })
  @IsOptional()
  stolenItems?: any[];

  @IsBoolean({ message: 'O campo de localização externa deve ser um booleano (true/false).' })
  @IsNotEmpty({ message: 'É obrigatório informar se a perícia é em local externo.' })
  isExternalLocation: boolean;

  @IsBoolean({ message: 'A flag de endereço não localizado deve ser sim ou não.' })
  @IsOptional()
  addressNotFound?: boolean;

  @IsBoolean({ message: 'A flag de ninguém no local deve ser sim ou não.' })
  @IsOptional()
  noOneOnSite?: boolean;

  // Validação Aninhada para o Endereço
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;
}