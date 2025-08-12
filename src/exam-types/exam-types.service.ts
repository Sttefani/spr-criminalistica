// Arquivo: src/exam-types/exam-types.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { ExamType } from './entities/exam-type.entity';

@Injectable()
export class ExamTypesService {
  constructor(
    @InjectRepository(ExamType)
    private examTypesRepository: Repository<ExamType>,
  ) {}

  /**
   * Cria um novo tipo de exame.
   */
  async create(createDto: CreateExamTypeDto): Promise<ExamType> {
    try {
      const examType = this.examTypesRepository.create(createDto);
      return await this.examTypesRepository.save(examType);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Um tipo de exame com este nome ou sigla já existe.');
      }
      throw error;
    }
  }

  /**
   * Retorna uma lista de todos os tipos de exame.
   */
  async findAll(): Promise<ExamType[]> {
    return this.examTypesRepository.find();
  }

  /**
   * Busca um tipo de exame específico pelo seu ID.
   */
  async findOne(id: string): Promise<ExamType> {
    const examType = await this.examTypesRepository.findOneBy({ id });
    if (!examType) {
      throw new NotFoundException(`Tipo de exame com o ID "${id}" não encontrado.`);
    }
    return examType;
  }

  /**
   * Atualiza os dados de um tipo de exame.
   */
  async update(id: string, updateDto: UpdateExamTypeDto): Promise<ExamType> {
    const examType = await this.examTypesRepository.preload({
      id: id,
      ...updateDto,
    });

    if (!examType) {
      throw new NotFoundException(`Tipo de exame com o ID "${id}" não encontrado.`);
    }

    try {
      return await this.examTypesRepository.save(examType);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Um tipo de exame com este nome ou sigla já existe.');
      }
      throw error;
    }
  }

  /**
   * Remove um tipo de exame (usando soft delete).
   */
  async remove(id: string): Promise<void> {
    const examType = await this.findOne(id);
    await this.examTypesRepository.softDelete(examType.id);
  }
}