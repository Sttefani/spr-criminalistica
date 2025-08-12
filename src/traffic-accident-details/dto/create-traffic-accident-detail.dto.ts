// Arquivo: src/traffic-accident-details/dto/create-traffic-accident-detail.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsNumber,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateTrafficAccidentDetailDto {
  // --- Relacionamento Obrigatório ---
  @IsUUID('4', { message: 'O ID da ocorrência deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID da ocorrência é obrigatório.' })
  occurrenceId: string;

  // --- Endereço Estruturado ---
  @IsString({ message: 'A rua deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome da rua é obrigatório.' })
  street: string;

  @IsString({ message: 'O número deve ser um texto.' })
  @IsOptional()
  number?: string;

  @IsString({ message: 'O bairro deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do bairro é obrigatório.' })
  neighborhood: string;

  @IsString({ message: 'O CEP deve ser um texto.' })
  @IsOptional()
  zipCode?: string;

  @IsString({ message: 'O ponto de referência deve ser um texto.' })
  @IsOptional()
  referencePoint?: string;

  // --- Geolocalização (Opcional) ---
  @IsLatitude({ message: 'A latitude informada é inválida.' })
  @IsOptional()
  latitude?: number;

  @IsLongitude({ message: 'A longitude informada é inválida.' })
  @IsOptional()
  longitude?: number;

  // --- Dados Dinâmicos (Opcional) ---
  @IsArray({ message: 'Os veículos envolvidos devem ser uma lista.' })
  @IsOptional()
  involvedVehicles?: any[];

  @IsArray({ message: 'As vítimas devem ser uma lista.' })
  @IsOptional()
  victims?: any[];
}
