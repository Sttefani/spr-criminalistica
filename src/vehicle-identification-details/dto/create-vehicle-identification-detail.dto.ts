// Arquivo: src/vehicle-identification-details/dto/create-vehicle-identification-detail.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsObject,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from 'src/common/dto/address.dto';

export class CreateVehicleIdentificationDetailDto {
  @IsUUID('4', { message: 'O ID da ocorrência deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'É obrigatório associar estes detalhes a uma ocorrência.' })
  occurrenceId: string;

  @IsObject({ message: 'Os detalhes do veículo devem ser um objeto.' })
  @IsNotEmpty({ message: 'É obrigatório informar os detalhes do veículo.' })
  vehicleDetails: any;

  @IsBoolean({ message: 'O campo de localização externa deve ser um booleano (true/false).' })
  @IsNotEmpty({ message: 'É obrigatório informar se a perícia é em local externo.' })
  isExternalLocation: boolean;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @IsArray({ message: 'A lista de exames selecionados é inválida.' })
  @IsUUID('4', { each: true, message: 'Cada exame selecionado deve ser válido.' })
  @IsOptional() // A avaliação de danos pode ser opcional
  examTypeIds?: string[];

  @IsObject({ message: 'Os campos adicionais são opcionais.' })
  @IsOptional()
  additionalFields?: any;
}