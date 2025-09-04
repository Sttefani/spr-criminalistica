/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateRequestingUnitDto } from './dto/create-requesting-unit.dto';
import { UpdateRequestingUnitDto } from './dto/update-requesting-unit.dto';
import { RequestingUnit } from './entities/requesting-unit.entity';

@Injectable()
export class RequestingUnitsService {
  constructor(
    @InjectRepository(RequestingUnit)
    private requestingUnitsRepository: Repository<RequestingUnit>,
  ) {}

  async create(createDto: CreateRequestingUnitDto): Promise<RequestingUnit> {
    try {
      const unit = this.requestingUnitsRepository.create(createDto);
      return await this.requestingUnitsRepository.save(unit);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-member-access
      if ((error as any).code === '23505') {
        throw new ConflictException('Uma unidade com este nome já existe.');
      }
      throw error;
    }
  }

  // ==========================================================
  // MÉTODO findAll CORRIGIDO PARA PAGINAÇÃO E BUSCA
  // ==========================================================
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: RequestingUnit[], total: number, page: number, limit: number }> {
    const skip = (page - 1) * limit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any[] = [];

    if (search) {
      where.push({ name: ILike(`%${search}%`) });
      where.push({ acronym: ILike(`%${search}%`) });
    }

    const [data, total] = await this.requestingUnitsRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
      order: { name: 'ASC' },
      skip,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<RequestingUnit> {
    const unit = await this.requestingUnitsRepository.findOneBy({ id });
    if (!unit) {
      throw new NotFoundException(`Unidade com o ID "${id}" não encontrada.`);
    }
    return unit;
  }

  async update(id: string, updateDto: UpdateRequestingUnitDto): Promise<RequestingUnit> {
    const unit = await this.requestingUnitsRepository.preload({ id, ...updateDto });
    if (!unit) {
      throw new NotFoundException(`Unidade com o ID "${id}" não encontrada.`);
    }
    try {
      return await this.requestingUnitsRepository.save(unit);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new ConflictException('Uma unidade com este nome já existe.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.requestingUnitsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Unidade com o ID "${id}" não encontrada.`);
    }
  }
}