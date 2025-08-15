// Arquivo: src/maintenances/dto/create-maintenance.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
  Min,
  IsPositive,
  IsEnum,
  IsObject,
} from 'class-validator';
import { MaintenanceType } from '../enums/maintenance-type.enum';

export class CreateMaintenanceDto {
  @IsUUID('4', { message: 'O ID da viatura é inválido.' })
  @IsNotEmpty({ message: 'A viatura é obrigatória.' })
  vehicleId: string;

  @IsString()
  @IsNotEmpty({ message: 'O prestador de serviço é obrigatório.' })
  serviceProvider: string;

  @IsDateString({}, { message: 'A data de início deve estar no formato ISO 8601.' })
  @IsNotEmpty({ message: 'A data de início é obrigatória.' })
  startDate: Date;

  @IsDateString({}, { message: 'A data de conclusão deve estar no formato ISO 8601.' })
  @IsOptional()
  endDate?: Date;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O custo deve ser um número com até 2 casas decimais.' })
  @Min(0, { message: 'O custo não pode ser negativo.' })
  @IsNotEmpty({ message: 'O custo do serviço é obrigatório.' })
  cost: number;

  @IsString()
  @IsNotEmpty({ message: 'A descrição do serviço é obrigatória.' })
  description: string;

  @IsEnum(MaintenanceType, { message: 'O tipo de manutenção é inválido.' })
  @IsNotEmpty({ message: 'O tipo de manutenção é obrigatório.' })
  type: MaintenanceType;

  @IsObject()
  @IsOptional()
  additionalFields?: any;
}
