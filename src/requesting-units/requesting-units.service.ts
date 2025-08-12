import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      if (error.code === '23505') {
        throw new ConflictException('Uma unidade com este nome já existe.');
      }
      throw error;
    }
  }

  async findAll(): Promise<RequestingUnit[]> {
    return this.requestingUnitsRepository.find();
  }

  async findOne(id: string): Promise<RequestingUnit> {
    const unit = await this.requestingUnitsRepository.findOneBy({ id });
    if (!unit) {
      throw new NotFoundException(`Unidade com o ID "${id}" não encontrada.`);
    }
    return unit;
  }

  async update(id: string, updateDto: UpdateRequestingUnitDto): Promise<RequestingUnit> {
    const unit = await this.requestingUnitsRepository.preload({
      id: id,
      ...updateDto,
    });

    if (!unit) {
      throw new NotFoundException(`Unidade com o ID "${id}" não encontrada.`);
    }

    try {
      return await this.requestingUnitsRepository.save(unit);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Uma unidade com este nome já existe.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const unit = await this.findOne(id);
    await this.requestingUnitsRepository.softDelete(unit.id);
  }
}