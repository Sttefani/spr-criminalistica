// Arquivo: src/patrimony-classifications/patrimony-subcategories.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatrimonySubcategory } from '../entities/patrimony-subcategory.entity';
import { PatrimonyCategory } from '../entities/patrimony-category.entity';
import { CreatePatrimonySubcategoryDto } from '../dto/create-patrimony-subcategory.dto';
import { UpdatePatrimonySubcategoryDto } from '../dto/update-patrimony-subcategory.dto';

@Injectable()
export class PatrimonySubcategoriesService {
  constructor(
    @InjectRepository(PatrimonySubcategory)
    private subcategoryRepository: Repository<PatrimonySubcategory>,
    @InjectRepository(PatrimonyCategory)
    private categoryRepository: Repository<PatrimonyCategory>,
  ) {}

  async create(createDto: CreatePatrimonySubcategoryDto): Promise<PatrimonySubcategory> {
    const { categoryId, name } = createDto;

    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException(`Categoria com o ID "${categoryId}" não encontrada.`);
    }

    const subcategory = this.subcategoryRepository.create({ name, category });
    return await this.subcategoryRepository.save(subcategory);
  }

  async findAll(): Promise<PatrimonySubcategory[]> {
    return this.subcategoryRepository.find({ relations: ['category'] });
  }

  async findOne(id: string): Promise<PatrimonySubcategory> {
    const subcategory = await this.subcategoryRepository.findOne({
        where: { id },
        relations: ['category'],
    });
    if (!subcategory) {
      throw new NotFoundException(`Subcategoria com o ID "${id}" não encontrada.`);
    }
    return subcategory;
  }

  async update(id: string, updateDto: UpdatePatrimonySubcategoryDto): Promise<PatrimonySubcategory> {
    const subcategory = await this.subcategoryRepository.preload({ id, ...updateDto });
    if (!subcategory) {
      throw new NotFoundException(`Subcategoria com o ID "${id}" não encontrada.`);
    }
    if (updateDto.categoryId) {
        const category = await this.categoryRepository.findOneBy({ id: updateDto.categoryId });
        if (!category) throw new NotFoundException(`Categoria com o ID "${updateDto.categoryId}" não encontrada.`);
        subcategory.category = category;
    }
    return await this.subcategoryRepository.save(subcategory);
  }

  async remove(id: string): Promise<void> {
    const result = await this.subcategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subcategoria com o ID "${id}" não encontrada.`);
    }
  }
}