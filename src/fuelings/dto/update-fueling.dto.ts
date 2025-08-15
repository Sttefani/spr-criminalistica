import { PartialType } from '@nestjs/mapped-types';
import { CreateFuelingDto } from './create-fueling.dto';

export class UpdateFuelingDto extends PartialType(CreateFuelingDto) {}
