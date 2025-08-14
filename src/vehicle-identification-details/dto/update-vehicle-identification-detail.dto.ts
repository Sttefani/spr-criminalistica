import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleIdentificationDetailDto } from './create-vehicle-identification-detail.dto';

export class UpdateVehicleIdentificationDetailDto extends PartialType(CreateVehicleIdentificationDetailDto) {}
