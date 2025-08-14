import { PartialType } from '@nestjs/mapped-types';
import { CreatePatrimonyMovementDto } from './create-patrimony-movement.dto';

export class UpdatePatrimonyMovementDto extends PartialType(CreatePatrimonyMovementDto) {}
