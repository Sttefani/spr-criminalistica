// Arquivo: src/patrimony-items/patrimony-items.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatrimonyItemsService } from './patrimony-items.service';
import { PatrimonyItemsController } from './patrimony-items.controller';
import { PatrimonyItem } from './entities/patrimony-item.entity';
import { User } from 'src/users/entities/users.entity';
import { Location } from 'src/locations/entities/location.entity';
import { PatrimonySubcategory } from 'src/patrimony-classifications/entities/patrimony-subcategory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatrimonyItem,
      User,
      Location,
      PatrimonySubcategory
    ]),
  ],
  controllers: [PatrimonyItemsController],
  providers: [PatrimonyItemsService],
})
export class PatrimonyItemsModule {}