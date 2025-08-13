import { PartialType } from '@nestjs/mapped-types';
import { CreateBallisticsDetailDto } from './create-ballistics-detail.dto';

export class UpdateBallisticsDetailDto extends PartialType(CreateBallisticsDetailDto) {}
