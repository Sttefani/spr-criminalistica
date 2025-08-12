import { PartialType } from '@nestjs/mapped-types';
import { CreateForensicServiceDto } from './create-forensic-service.dto';

export class UpdateForensicServiceDto extends PartialType(CreateForensicServiceDto) {}
