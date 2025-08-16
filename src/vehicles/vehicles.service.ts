// Arquivo: src/vehicles/vehicles.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  async create(createDto: CreateVehicleDto): Promise<Vehicle> {
    try {
      const vehicle = this.vehiclesRepository.create(createDto);
      return await this.vehiclesRepository.save(vehicle);
    } catch (error) {
      if (error.code === '23505') { // Erro de violação de chave única (placa ou renavam)
        throw new ConflictException('Um veículo com esta placa ou renavam já existe.');
      }
      throw error;
    }
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehiclesRepository.find();
  }

  async findByPlate(plate?: string): Promise<Vehicle[]> {
    const options: FindManyOptions<Vehicle> = {};
    if (plate) {
      options.where = { plate: Like(`%${plate.toUpperCase()}%`) };
    }
    return this.vehiclesRepository.find(options);
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOneBy({ id });
    if (!vehicle) {
      throw new NotFoundException(`Viatura com o ID "${id}" não encontrada.`);
    }
    return vehicle;
  }

  async update(id: string, updateDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.preload({ id, ...updateDto });
    if (!vehicle) {
      throw new NotFoundException(`Viatura com o ID "${id}" não encontrada.`);
    }
    try {
      return await this.vehiclesRepository.save(vehicle);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Um veículo com esta placa ou renavam já existe.');
      }
      throw error;
    }
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const result = await this.vehiclesRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Viatura com o ID "${id}" não encontrada.`);
    }
  }
}