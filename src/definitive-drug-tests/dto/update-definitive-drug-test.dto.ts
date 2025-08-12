import { PartialType } from '@nestjs/mapped-types';
import { CreateDefinitiveDrugTestDto } from './create-definitive-drug-test.dto';

export class UpdateDefinitiveDrugTestDto extends PartialType(CreateDefinitiveDrugTestDto) {}
