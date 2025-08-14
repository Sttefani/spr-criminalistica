import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';

// A classe UpdateVehicleDto herda todas as propriedades e
// validadores da CreateVehicleDto, mas o PartialType
// torna cada uma delas opcional.
export class UpdateVehicleDto extends PartialType(
  CreateVehicleDto,
) {}
