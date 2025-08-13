import { PartialType } from '@nestjs/mapped-types';
import { CreateBiologyForensicsDetailDto } from './create-biology-forensics-detail.dto';

export class UpdateBiologyForensicsDetailDto extends PartialType(CreateBiologyForensicsDetailDto) {}
