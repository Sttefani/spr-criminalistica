// Arquivo: src/stock-entries/stock-entries.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';
import { StockEntry } from './entities/stock-entry.entity';
import { StockItem } from 'src/stock-items/entities/stock-item.entity';
import { User } from 'src/users/entities/users.entity';
import { StockItemsService } from 'src/stock-items/stock-items.service';

@Injectable()
export class StockEntriesService {
  constructor(
    @InjectRepository(StockEntry)
    private entriesRepository: Repository<StockEntry>,
    @InjectRepository(StockItem)
    private itemsRepository: Repository<StockItem>,
    // Injetamos o StockItemsService para a futura lógica de atualização de estoque
    private stockItemsService: StockItemsService,
  ) {}

  async create(createDto: CreateStockEntryDto, creatingUser: User): Promise<StockEntry> {
    const { stockItemId, ...entryData } = createDto;
    
    const stockItem = await this.itemsRepository.findOneBy({ id: stockItemId });
    if (!stockItem) {
      throw new NotFoundException(`Item de estoque com o ID "${stockItemId}" não encontrado.`);
    }

    const newEntry = this.entriesRepository.create({
      ...entryData,
      stockItem,
      user: creatingUser,
    });
    
    const savedEntry = await this.entriesRepository.save(newEntry);
    // TODO: Chamar o método de atualização do estoque geral aqui no futuro
    // await this.stockItemsService.updateStockLevel(stockItemId);
    await this.stockItemsService.updateStockLevel(stockItemId);

    return savedEntry;
  }

  async findAllByItem(stockItemId: string): Promise<StockEntry[]> {
    return this.entriesRepository.find({
      where: { stockItem: { id: stockItemId } },
      relations: ['user'],
      order: { entryDate: 'DESC' },
    });

  }

  async remove(id: string): Promise<void> {
    const entry = await this.entriesRepository.findOne({
        where: { id },
        relations: ['stockItem'],
    });
    if (!entry) {
        throw new NotFoundException(`Registro de entrada com o ID "${id}" não encontrado.`);
    }

    const stockItemId = entry.stockItem.id;
    const result = await this.entriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro de entrada com o ID "${id}" não encontrado.`);
    }
    
    // TODO: Chamar o método de atualização do estoque geral aqui no futuro
    // await this.stockItemsService.updateStockLevel(stockItemId);
  }
}