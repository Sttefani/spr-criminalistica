// Arquivo: src/patrimony-classifications/patrimony-categories.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatrimonyCategory } from '../entities/patrimony-category.entity';
import { CreatePatrimonyCategoryDto } from '../dto/create-patrimony-category.dto';
import { UpdatePatrimonyCategoryDto } from '../dto/update-patrimony-category.dto';

@Injectable()
export class PatrimonyCategoriesService {
  constructor(
    @InjectRepository(PatrimonyCategory)
    private categoryRepository: Repository<PatrimonyCategory>,
  ) {}

  async create(createDto: CreatePatrimonyCategoryDto): Promise<PatrimonyCategory> {
    try {
      const category = this.categoryRepository.create(createDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Uma categoria com este nome já existe.');
      }
      throw error;
    }
  }

  async findAll(): Promise<PatrimonyCategory[]> {
    // Trazemos as subcategorias junto na listagem
    return this.categoryRepository.find({ relations: ['subcategories'] });
  }

  async findOne(id: string): Promise<PatrimonyCategory> {
    const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['subcategories'],
    });
    if (!category) {
      throw new NotFoundException(`Categoria com o ID "${id}" não encontrada.`);
    }
    return category;
  }

  async update(id: string, updateDto: UpdatePatrimonyCategoryDto): Promise<PatrimonyCategory> {
    const category = await this.categoryRepository.preload({ id, ...updateDto });
    if (!category) {
      throw new NotFoundException(`Categoria com o ID "${id}" não encontrada.`);
    }
    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Uma categoria com este nome já existe.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    // Usamos delete de verdade aqui, pois é um cadastro de apoio.
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Categoria com o ID "${id}" não encontrada.`);
    }
  }
}