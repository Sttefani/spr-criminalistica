/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOccurrenceClassificationDto } from './dto/create-occurrence-classification.dto';
import { UpdateOccurrenceClassificationDto } from './dto/update-occurrence-classification.dto';
import { OccurrenceClassification } from './entities/occurrence-classification.entity';

@Injectable()
export class OccurrenceClassificationsService {
  constructor(
    @InjectRepository(OccurrenceClassification)
    private classificationsRepository: Repository<OccurrenceClassification>,
  ) {}

  async create(createDto: CreateOccurrenceClassificationDto): Promise<OccurrenceClassification> {
    try {
      const classification = this.classificationsRepository.create(createDto);
      return await this.classificationsRepository.save(classification);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new ConflictException('Uma classificação com este código ou nome já existe.');
      }
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    group?: string,
  ): Promise<{ data: OccurrenceClassification[], total: number, page: number, limit: number }> {
    const skip = (page - 1) * limit;
    const qb = this.classificationsRepository.createQueryBuilder('classification');

    if (search) {
      qb.andWhere('(LOWER(classification.name) LIKE LOWER(:search) OR LOWER(classification.code) LIKE LOWER(:search))', {
        search: `%${search}%`,
      });
    }

    if (group && group !== 'all') { // Adicionado para ignorar 'all'
      qb.andWhere('classification.group = :group', { group });
    }

    qb.orderBy('classification.group', 'ASC')
      .addOrderBy('classification.name', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  // MÉTODO CORRIGIDO
  async findAllGroups(): Promise<string[]> {
  const query = this.classificationsRepository
    .createQueryBuilder('classification')
    // 1. Apenas selecionamos a coluna que queremos
    .select('classification.group', 'group') 
    // 2. Usamos .distinct(true) para garantir resultados únicos
    .distinct(true) 
    .where('classification.group IS NOT NULL')
    .andWhere("classification.group != ''")
    .orderBy('classification.group', 'ASC');

  // O TypeORM automaticamente adicionará a condição para ignorar os deletados
  // ao usar o QueryBuilder em uma entidade com @DeleteDateColumn.

  const results = await query.getRawMany();

  // Mapeia o resultado (que é [{ group: 'valor' }]) para um array de strings
  return results.map(item => item.group);
}
  async findOne(id: string): Promise<OccurrenceClassification> {
    const classification = await this.classificationsRepository.findOneBy({ id });
    if (!classification) {
      throw new NotFoundException(`Classificação com o ID "${id}" não encontrada.`);
    }
    return classification;
  }

  async update(id: string, updateDto: UpdateOccurrenceClassificationDto): Promise<OccurrenceClassification> {
    const classification = await this.classificationsRepository.preload({ id, ...updateDto });
    if (!classification) {
      throw new NotFoundException(`Classificação com o ID "${id}" não encontrada.`);
    }
    try {
      return await this.classificationsRepository.save(classification);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new ConflictException('Uma classificação com este código ou nome já existe.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.classificationsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Classificação com o ID "${id}" não encontrada.`);
    }
  }
}