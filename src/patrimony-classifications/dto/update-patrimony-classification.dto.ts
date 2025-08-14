import { PartialType } from '@nestjs/mapped-types';
import { CreatePatrimonyClassificationDto } from './create-patrimony-classification.dto';

export class UpdatePatrimonyClassificationDto extends PartialType(CreatePatrimonyClassificationDto) {}
