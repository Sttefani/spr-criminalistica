/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { ExamType } from './entities/exam-type.entity';

@Injectable()
export class ExamTypesService {
  constructor(
    @InjectRepository(ExamType)
    private examTypesRepository: Repository<ExamType>,
  ) {}

  async create(createDto: CreateExamTypeDto): Promise<ExamType> {
    try {
      const examType = this.examTypesRepository.create(createDto);
      return await this.examTypesRepository.save(examType);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new ConflictException('Um tipo de exame com este nome ou sigla já existe.');
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
  ): Promise<{ data: ExamType[], total: number, page: number, limit: number }> {
    const skip = (page - 1) * limit;
    const where: any[] = [];

    // Busca pelo nome OU pela sigla
    if (search) {
      where.push({ name: ILike(`%${search}%`) });
      where.push({ acronym: ILike(`%${search}%`) });
    }

    const [data, total] = await this.examTypesRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
      order: { name: 'ASC' },
      skip,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<ExamType> {
    const examType = await this.examTypesRepository.findOneBy({ id });
    if (!examType) {
      throw new NotFoundException(`Tipo de exame com o ID "${id}" não encontrado.`);
    }
    return examType;
  }

  async update(id: string, updateDto: UpdateExamTypeDto): Promise<ExamType> {
    const examType = await this.examTypesRepository.preload({ id, ...updateDto });
    if (!examType) {
      throw new NotFoundException(`Tipo de exame com o ID "${id}" não encontrado.`);
    }
    try {
      return await this.examTypesRepository.save(examType);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new ConflictException('Um tipo de exame com este nome ou sigla já existe.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.examTypesRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tipo de exame com o ID "${id}" não encontrado.`);
    }
  }
}