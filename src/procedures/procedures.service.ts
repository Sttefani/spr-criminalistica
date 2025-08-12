// Arquivo: src/procedures/procedures.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { Procedure } from './entities/procedure.entity';

@Injectable()
export class ProceduresService {
  constructor(
    @InjectRepository(Procedure)
    private proceduresRepository: Repository<Procedure>,
  ) {}

  /**
   * Cria um novo procedimento.
   */
  async create(createDto: CreateProcedureDto): Promise<Procedure> {
    try {
      const procedure = this.proceduresRepository.create(createDto);
      return await this.proceduresRepository.save(procedure);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Um procedimento com este nome ou sigla já existe.');
      }
      throw error;
    }
  }

  /**
   * Retorna uma lista de todos os procedimentos.
   */
  async findAll(): Promise<Procedure[]> {
    return this.proceduresRepository.find();
  }

  /**
   * Busca um procedimento específico pelo seu ID.
   */
  async findOne(id: string): Promise<Procedure> {
    const procedure = await this.proceduresRepository.findOneBy({ id });
    if (!procedure) {
      throw new NotFoundException(`Procedimento com o ID "${id}" não encontrado.`);
    }
    return procedure;
  }

  /**
   * Atualiza os dados de um procedimento.
   */
  async update(id: string, updateDto: UpdateProcedureDto): Promise<Procedure> {
    const procedure = await this.proceduresRepository.preload({
      id: id,
      ...updateDto,
    });

    if (!procedure) {
      throw new NotFoundException(`Procedimento com o ID "${id}" não encontrado.`);
    }

    try {
      return await this.proceduresRepository.save(procedure);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Um procedimento com este nome ou sigla já existe.');
      }
      throw error;
    }
  }

  /**
   * Remove um procedimento (usando soft delete).
   */
  async remove(id: string): Promise<void> {
    const procedure = await this.findOne(id);
    await this.proceduresRepository.softDelete(procedure.id);
  }
}