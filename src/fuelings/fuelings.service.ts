// Arquivo: src/fuelings/fuelings.service.ts

import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFuelingDto } from './dto/create-fueling.dto';
import { UpdateFuelingDto } from './dto/update-fueling.dto';
import { Fueling } from './entities/fueling.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';

@Injectable()
export class FuelingsService {
  constructor(
    @InjectRepository(Fueling)
    private fuelingsRepository: Repository<Fueling>,
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  async create(createDto: CreateFuelingDto, creatingUser: User): Promise<Fueling> {
    const { vehicleId, mileage, ...fuelingData } = createDto;

    const vehicle = await this.vehiclesRepository.findOneBy({ id: vehicleId });
    if (!vehicle) {
      throw new NotFoundException(`Viatura com o ID "${vehicleId}" não encontrada.`);
    }
    
    // Validação de quilometragem
    const lastFueling = await this.fuelingsRepository.findOne({
        where: { vehicle: { id: vehicleId } },
        order: { date: 'DESC' },
    });

    const previousMileage = lastFueling ? lastFueling.mileage : vehicle.initialMileage;
    if (mileage < previousMileage) {
        throw new BadRequestException(`A quilometragem informada (${mileage} km) não pode ser menor que a anterior (${previousMileage} km).`);
    }

    const newFueling = this.fuelingsRepository.create({
      ...fuelingData,
      mileage,
      vehicle,
      user: creatingUser,
    });

    return this.fuelingsRepository.save(newFueling);
  }

  async findAllByVehicle(vehicleId: string): Promise<Fueling[]> {
    return this.fuelingsRepository.find({
      where: { vehicle: { id: vehicleId } },
      relations: ['user'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Fueling> {
    const fueling = await this.fuelingsRepository.findOne({
        where: { id },
        relations: ['vehicle', 'user']
    });
    if (!fueling) {
      throw new NotFoundException(`Registro de abastecimento com o ID "${id}" não encontrado.`);
    }
    return fueling;
  }

  async update(id: string, updateDto: UpdateFuelingDto, currentUser: User): Promise<Fueling> {
    const fuelingToUpdate = await this.findOne(id);

    // --- LÓGICA DE PERMISSÃO DE EDIÇÃO ---
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
        // Verifica se este é o último abastecimento para esta viatura
        const lastFueling = await this.fuelingsRepository.findOne({
            where: { vehicle: { id: fuelingToUpdate.vehicle.id } },
            order: { date: 'DESC' },
        });

        // Se o ID do último abastecimento não for o mesmo que estamos tentando editar, bloqueia.
        if (lastFueling?.id !== id) {
            throw new ForbiddenException('Este registro não pode ser editado pois não é o mais recente. Contate um administrador.');
        }
    }
    // --- FIM DA LÓGICA ---

    const updatedFueling = this.fuelingsRepository.merge(fuelingToUpdate, updateDto);
    return this.fuelingsRepository.save(updatedFueling);
  }

  async remove(id: string): Promise<void> {
    // Adicionamos soft delete à entidade Fueling
    const result = await this.fuelingsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro de abastecimento com o ID "${id}" não encontrado.`);
    }
  }
}