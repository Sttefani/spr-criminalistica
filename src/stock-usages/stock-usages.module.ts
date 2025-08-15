// Arquivo: src/stock-usages/stock-usages.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockUsagesService } from './stock-usages.service';
import { StockUsagesController } from './stock-usages.controller';
import { StockUsage } from './entities/stock-usage.entity';
import { StockItem } from 'src/stock-items/entities/stock-item.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { User } from 'src/users/entities/users.entity';
import { StockItemsModule } from 'src/stock-items/stock-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockUsage,
      StockItem,
      GeneralOccurrence,
      User,
    ]),
    StockItemsModule, // Para ter acesso ao StockItemsService
  ],
  controllers: [StockUsagesController],
  providers: [StockUsagesService],
})
export class StockUsagesModule {}