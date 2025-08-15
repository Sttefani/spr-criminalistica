// Arquivo: src/stock-items/stock-items.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockItemsService } from './stock-items.service';
import { StockItemsController } from './stock-items.controller';
import { StockItem } from './entities/stock-item.entity';
import { StockEntry } from 'src/stock-entries/entities/stock-entry.entity'; // 1. IMPORTE
import { StockUsage } from 'src/stock-usages/entities/stock-usage.entity'; // 2. IMPORTE

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockItem,
      StockEntry, // 3. ADICIONE AQUI
      StockUsage, // 4. ADICIONE AQUI
    ]),
  ],
  controllers: [StockItemsController],
  providers: [StockItemsService],
  exports: [StockItemsService],
})
export class StockItemsModule {}