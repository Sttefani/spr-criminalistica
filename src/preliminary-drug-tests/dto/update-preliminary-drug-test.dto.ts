import { PartialType } from '@nestjs/mapped-types';
import { CreatePreliminaryDrugTestDto } from './create-preliminary-drug-test.dto';

export class UpdatePreliminaryDrugTestDto extends PartialType(CreatePreliminaryDrugTestDto) {}
