import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsOptional,
  Min,
  Max,
  Length,
} from 'class-validator';
import { VehicleType } from '../enums/vehicle-type.enum';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty({ message: 'A placa é obrigatória.' })
  @Length(7, 7, { message: 'A placa deve ter 7 caracteres.' })
  plate: string;

  @IsString()
  @IsNotEmpty({ message: 'A marca é obrigatória.' })
  brand: string;

  @IsString()
  @IsNotEmpty({ message: 'O modelo é obrigatório.' })
  model: string;

  @IsInt({ message: 'O ano deve ser um número inteiro.' })
  @Min(1980, { message: 'O ano não pode ser inferior a 1980.' })
  @Max(new Date().getFullYear() + 1, { message: 'O ano não pode ser futuro.' })
  year: number;

  @IsEnum(VehicleType, { message: 'O tipo de veículo é inválido.' })
  @IsNotEmpty({ message: 'O tipo de veículo é obrigatório.' })
  type: VehicleType;

  @IsString()
  @IsOptional()
  renavam?: string;

  @IsInt({ message: 'A quilometragem inicial deve ser um número inteiro.' })
  @Min(0, { message: 'A quilometragem não pode ser negativa.' })
  @IsNotEmpty({ message: 'A quilometragem inicial é obrigatória.' })
  initialMileage: number;
}
