// Arquivo: src/stock-items/stock-items.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStockItemDto } from './dto/create-stock-item.dto';
import { UpdateStockItemDto } from './dto/update-stock-item.dto';
import { StockItem } from './entities/stock-item.entity';
import { StockEntry } from 'src/stock-entries/entities/stock-entry.entity';
import { StockUsage } from 'src/stock-usages/entities/stock-usage.entity';

@Injectable()
export class StockItemsService {
  constructor(
    @InjectRepository(StockItem)
    private itemsRepository: Repository<StockItem>,
    @InjectRepository(StockEntry)
    private entriesRepository: Repository<StockEntry>,
    @InjectRepository(StockUsage)
    private usagesRepository: Repository<StockUsage>,
  ) {}

  async create(createDto: CreateStockItemDto): Promise<StockItem> {
    try {
      const item = this.itemsRepository.create(createDto);
      return await this.itemsRepository.save(item);
    } catch (error) {
      if (error.code === '23505') { // Erro de violação de chave única para 'name'
        throw new ConflictException('Um item de estoque com este nome já existe.');
      }
      throw error;
    }
  }

  async findAll(): Promise<StockItem[]> {
    return this.itemsRepository.find();
  }

  async findOne(id: string): Promise<StockItem> {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item de estoque com o ID "${id}" não encontrado.`);
    }
    return item;
  }

  async update(id: string, updateDto: UpdateStockItemDto): Promise<StockItem> {
    const item = await this.itemsRepository.preload({ id, ...updateDto });
    if (!item) {
      throw new NotFoundException(`Item de estoque com o ID "${id}" não encontrado.`);
    }
    try {
      return await this.itemsRepository.save(item);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Um item de estoque com este nome já existe.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.itemsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Item de estoque com o ID "${id}" não encontrado.`);
    }
  }

  async updateStockLevel(stockItemId: string): Promise<void> {
    // Busca o total de todas as entradas para este item
    const totalEntriesResult = await this.entriesRepository
      .createQueryBuilder('entry')
      .select('SUM(entry.quantity)', 'total')
      .where('entry.stockItemId = :stockItemId', { stockItemId })
      .getRawOne();
    const totalEntries = Number(totalEntriesResult.total) || 0;

    // Busca o total de todas as saídas para este item
    const totalUsagesResult = await this.usagesRepository
      .createQueryBuilder('usage')
      .select('SUM(usage.quantityUsed)', 'total')
      .where('usage.stockItemId = :stockItemId', { stockItemId })
      .getRawOne();
    const totalUsages = Number(totalUsagesResult.total) || 0;

    const currentStock = totalEntries - totalUsages;

    // Atualiza o campo 'currentStock' no item do catálogo
    await this.itemsRepository.update(stockItemId, { currentStock });

    // TODO: Adicionar a lógica de emitir evento se o estoque estiver baixo
  }
}