// Arquivo: src/stock-entries/stock-entries.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntriesService } from './stock-entries.service';
import { StockEntriesController } from './stock-entries.controller';
import { StockEntry } from './entities/stock-entry.entity';
import { StockItem } from 'src/stock-items/entities/stock-item.entity';
import { User } from 'src/users/entities/users.entity';

// Importamos o módulo de StockItems para ter acesso ao serviço dele
import { StockItemsModule } from 'src/stock-items/stock-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockEntry,
      StockItem,
      User,
    ]),
    StockItemsModule, // Importamos o módulo para poder injetar o StockItemsService
  ],
  controllers: [StockEntriesController],
  providers: [StockEntriesService],
})
export class StockEntriesModule {}