import { PartialType } from '@nestjs/mapped-types';
import { CreatePatrimonyCategoryDto } from './create-patrimony-category.dto';

export class UpdatePatrimonyCategoryDto extends PartialType(
  CreatePatrimonyCategoryDto,
) {}