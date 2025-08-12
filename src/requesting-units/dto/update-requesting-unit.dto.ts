import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestingUnitDto } from './create-requesting-unit.dto';

export class UpdateRequestingUnitDto extends PartialType(CreateRequestingUnitDto) {}