import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async create(createDto: CreateLocationDto): Promise<Location> {
    try {
      const location = this.locationsRepository.create(createDto);
      return await this.locationsRepository.save(location);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Uma localização com este nome já existe.');
      }
      throw error;
    }
  }

  async findAll(): Promise<Location[]> {
    return this.locationsRepository.find();
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationsRepository.findOneBy({ id });
    if (!location) {
      throw new NotFoundException(`Localização com o ID "${id}" não encontrada.`);
    }
    return location;
  }

  async update(id: string, updateDto: UpdateLocationDto): Promise<Location> {
    const location = await this.locationsRepository.preload({ id, ...updateDto });
    if (!location) {
      throw new NotFoundException(`Localização com o ID "${id}" não encontrada.`);
    }
    try {
      return await this.locationsRepository.save(location);
    } catch (error) {
      if (error.code === '23505') {
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