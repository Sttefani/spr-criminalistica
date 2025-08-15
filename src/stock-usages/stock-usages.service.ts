// Arquivo: src/stock-usages/stock-usages.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStockUsageDto } from './dto/create-stock-usage.dto';
import { StockUsage } from './entities/stock-usage.entity';
import { StockItem } from 'src/stock-items/entities/stock-item.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { User } from 'src/users/entities/users.entity';
import { StockItemsService } from 'src/stock-items/stock-items.service';

@Injectable()
export class StockUsagesService {
  constructor(
    @InjectRepository(StockUsage)
    private usagesRepository: Repository<StockUsage>,
    @InjectRepository(StockItem)
    private itemsRepository: Repository<StockItem>,
    @InjectRepository(GeneralOccurrence)
    private occurrencesRepository: Repository<GeneralOccurrence>,
    private stockItemsService: StockItemsService,
  ) {}

  async create(createDto: CreateStockUsageDto, creatingUser: User): Promise<StockUsage> {
    const { stockItemId, relatedOccurrenceId, quantityUsed, ...usageData } = createDto;

    const stockItem = await this.itemsRepository.findOneBy({ id: stockItemId });
    if (!stockItem) {
      throw new NotFoundException(`Item de estoque com o ID "${stockItemId}" não encontrado.`);
    }

    // Validação de estoque
    if (stockItem.currentStock < quantityUsed) {
      throw new BadRequestException(`Estoque insuficiente. Estoque atual: ${stockItem.currentStock}, Quantidade solicitada: ${quantityUsed}.`);
    }

    let relatedOccurrence: GeneralOccurrence | null = null;
    if (relatedOccurrenceId) {
      relatedOccurrence = await this.occurrencesRepository.findOneBy({ id: relatedOccurrenceId });
      if (!relatedOccurrence) {
        throw new NotFoundException(`Ocorrência com o ID "${relatedOccurrenceId}" não encontrada.`);
      }
    }

    const newUsage = this.usagesRepository.create({
      ...usageData,
      quantityUsed,
      stockItem,
      relatedOccurrence,
      user: creatingUser,
    });
    
    const savedUsage = await this.usagesRepository.save(newUsage);

    // APÓS SALVAR A SAÍDA, ATUALIZA O NÍVEL DE ESTOQUE
    await this.stockItemsService.updateStockLevel(stockItemId);

    return savedUsage;
  }

  async findAllByItem(stockItemId: string): Promise<StockUsage[]> {
    return this.usagesRepository.find({
      where: { stockItem: { id: stockItemId } },
      relations: ['user', 'relatedOccurrence'],
      order: { usageDate: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const usage = await this.usagesRepository.findOne({
      where: { id },
      relations: ['stockItem'],
    });
    if (!usage) {
      throw new NotFoundException(`Registro de uso com o ID "${id}" não encontrado.`);
    }

    const stockItemId = usage.stockItem.id;
    const result = await this.usagesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro de uso com o ID "${id}" não encontrado.`);
    }

    // APÓS DELETAR (ESTORNAR) A SAÍDA, ATUALIZA O NÍVEL DE ESTOQUE
    await this.stockItemsService.updateStockLevel(stockItemId);
  }
}
