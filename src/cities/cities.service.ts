/* eslint-disable prettier/prettier */
// Arquivo: src/cities/cities.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from 'src/cities/entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  /**
   * Cria uma nova cidade no banco de dados.
   */
  async create(createCityDto: CreateCityDto): Promise<City> {
    try {
      const city = this.citiesRepository.create(createCityDto);
      return await this.citiesRepository.save(city);
    } catch (error) {
      if (error.code === '23505') { // Código de erro do PostgreSQL para violação de chave única
        throw new ConflictException('Uma cidade com este nome já existe neste estado.');
      }
      throw error;
    }
  }

  /**
   * Retorna uma lista de todas as cidades.
   */
  async findAll(): Promise<City[]> {
    return this.citiesRepository.find();
  }

  /**
   * Busca uma cidade específica pelo seu ID.
   */
  async findOne(id: string): Promise<City> {
    const city = await this.citiesRepository.findOneBy({ id });
    if (!city) {
      throw new NotFoundException(`Cidade com o ID "${id}" não encontrada.`);
    }
    return city;
  }

  /**
   * Atualiza os dados de uma cidade.
   */
  async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    // O 'preload' carrega a entidade existente e mescla os novos dados do DTO nela.
    // Se a cidade com o ID não existir, ele retorna undefined.
    const city = await this.citiesRepository.preload({
      id: id,
      ...updateCityDto,
    });

    if (!city) {
      throw new NotFoundException(`Cidade com o ID "${id}" não encontrada.`);
    }

    try {
      return await this.citiesRepository.save(city);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Uma cidade com este nome já existe neste estado.');
      }
      throw error;
    }
  }

  /**
   * Remove uma cidade (usando soft delete).
   */
  async remove(id: string): Promise<void> {
    const city = await this.findOne(id); // Reutiliza o método findOne para checar se existe
    await this.citiesRepository.softDelete(city.id);
  }
}
