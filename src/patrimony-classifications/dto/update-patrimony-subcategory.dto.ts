import { PartialType } from '@nestjs/mapped-types';
import { CreatePatrimonySubcategoryDto } from './create-patrimony-subcategory.dto';

export class UpdatePatrimonySubcategoryDto extends PartialType(
  CreatePatrimonySubcategoryDto,
) {}