import { PartialType } from '@nestjs/mapped-types';
import { CreateComputerForensicsDetailDto } from './create-computer-forensics-detail.dto';

export class UpdateComputerForensicsDetailDto extends PartialType(CreateComputerForensicsDetailDto) {}
