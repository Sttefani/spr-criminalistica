import { PartialType } from '@nestjs/mapped-types';
import { CreatePatrimonyItemDto } from './create-patrimony-item.dto';

export class UpdatePatrimonyItemDto extends PartialType(CreatePatrimonyItemDto) {}
