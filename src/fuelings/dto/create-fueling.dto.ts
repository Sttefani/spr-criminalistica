// Arquivo: src/fuelings/dto/create-fueling.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsNumber,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateFuelingDto {
  @IsUUID('4', { message: 'O ID da viatura é inválido.' })
  @IsNotEmpty({ message: 'A viatura é obrigatória.' })
  vehicleId: string;

  @IsDateString({}, { message: 'A data do abastecimento deve estar no formato ISO 8601.' })
  @IsNotEmpty({ message: 'A data do abastecimento é obrigatória.' })
  date: Date;

  @IsNumber({}, { message: 'A quilometragem deve ser um número.' })
  @Min(0, { message: 'A quilometragem não pode ser negativa.' })
  @IsNotEmpty({ message: 'A quilometragem da viatura é obrigatória.' })
  mileage: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'A quantidade de litros deve ser um número com até 2 casas decimais.' })
  @IsPositive({ message: 'A quantidade de litros deve ser um número positivo.' })
  @IsNotEmpty({ message: 'A quantidade de litros é obrigatória.' })
  liters: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O custo total deve ser um número com até 2 casas decimais.' })
  @IsPositive({ message: 'O custo total deve ser um número positivo.' })
  @IsNotEmpty({ message: 'O custo total é obrigatório.' })
  totalCost: number;

  @IsString()
  @IsNotEmpty({ message: 'O nome do posto de combustível é obrigatório.' })
  gasStation: string;
}