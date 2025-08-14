// Arquivo: src/patrimony-classifications/patrimony-classifications.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatrimonyClassificationsService } from './patrimony-classifications.service';
import { PatrimonyClassificationsController } from './patrimony-classifications.controller';
import { PatrimonyCategory } from './entities/patrimony-category.entity';
import { PatrimonySubcategory } from './entities/patrimony-subcategory.entity';
import { PatrimonyCategoriesService } from './patrimony-categories/patrimony-categories.service';
import { PatrimonySubcategoriesService } from './patrimony-subcategories/patrimony-subcategories.service';
import { PatrimonyCategoriesController } from './patrimony-categories/patrimony-categories.controller';
import { PatrimonySubcategoriesController } from './patrimony-subcategories/patrimony-subcategories.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatrimonyCategory,
      PatrimonySubcategory,
    ]),
  ],
  controllers: [PatrimonyClassificationsController, PatrimonyCategoriesController, PatrimonySubcategoriesController],
  providers: [PatrimonyClassificationsService, PatrimonyCategoriesService, PatrimonySubcategoriesService],
})
export class PatrimonyClassificationsModule {}