/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { QueryFailedError } from 'typeorm'; // Importação para tipagem de erro

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  // ==========================================================
  // MÉTODO CREATE COM TRATAMENTO DE ERRO ROBUSTO
  // ==========================================================
  async create(createDto: CreateLocationDto): Promise<Location> {
    const location = this.locationsRepository.create(createDto);
    try {
      return await this.locationsRepository.save(location);
    } catch (error) {
      // Verificamos se o erro é do tipo QueryFailedError e se o código é 23505
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new ConflictException('Uma localização com este nome já existe.');
      }
      // Se não for, relança o erro original
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: Location[], total: number, page: number, limit: number }> {
    const skip = (page - 1) * limit;
    const whereConditions: any = {};
    if (search) {
      whereConditions.name = ILike(`%${search}%`);
    }
    const [data, total] = await this.locationsRepository.findAndCount({
      where: whereConditions,
      order: { name: 'ASC' },
      skip: skip,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationsRepository.findOneBy({ id });
    if (!location) {
      throw new NotFoundException(`Localização com o ID "${id}" não encontrada.`);
    }
    return location;
  }

  // ==========================================================
  // MÉTODO UPDATE COM TRATAMENTO DE ERRO ROBUSTO
  // ==========================================================
  async update(id: string, updateDto: UpdateLocationDto): Promise<Location> {
    const location = await this.locationsRepository.preload({ id, ...updateDto });
    if (!location) {
      throw new NotFoundException(`Localização com o ID "${id}" não encontrada.`);
    }
    try {
      return await this.locationsRepository.save(location);
    } catch (error) {
      // A mesma verificação explícita aqui
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new ConflictException('Uma localização com este nome já existe.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.locationsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Localização com o ID "${id}" não encontrada.`);
    }
  }
}