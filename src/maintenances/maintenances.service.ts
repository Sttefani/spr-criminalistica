// Arquivo: src/maintenances/maintenances.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance } from './entities/maintenance.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { VehicleStatus } from 'src/vehicles/enums/vehicle-status.enum';

@Injectable()
export class MaintenancesService {
  constructor(
    @InjectRepository(Maintenance)
    private maintenancesRepository: Repository<Maintenance>,
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  async create(createDto: CreateMaintenanceDto): Promise<Maintenance> {
    const { vehicleId, ...maintenanceData } = createDto;

    const vehicle = await this.vehiclesRepository.findOneBy({ id: vehicleId });
    if (!vehicle) {
      throw new NotFoundException(`Viatura com o ID "${vehicleId}" não encontrada.`);
    }

    if (vehicle.status === VehicleStatus.IN_MAINTENANCE) {
      throw new BadRequestException('Esta viatura já está em manutenção.');
    }

    // --- REGRA DE NEGÓCIO: MUDA O STATUS DA VIATURA ---
    vehicle.status = VehicleStatus.IN_MAINTENANCE;

    const newMaintenance = this.maintenancesRepository.create({
      ...maintenanceData,
      vehicle,
    });

    // Salva a viatura atualizada e a nova manutenção em uma transação
    await this.maintenancesRepository.manager.transaction(async (manager) => {
      await manager.save(vehicle);
      await manager.save(newMaintenance);
    });

    return newMaintenance;
  }

  async findAllByVehicle(vehicleId: string): Promise<Maintenance[]> {
    return this.maintenancesRepository.find({
      where: { vehicle: { id: vehicleId } },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Maintenance> {
    const maintenance = await this.maintenancesRepository.findOne({
        where: { id },
        relations: ['vehicle']
    });
    if (!maintenance) {
      throw new NotFoundException(`Registro de manutenção com o ID "${id}" não encontrado.`);
    }
    return maintenance;
  }

  async update(id: string, updateDto: UpdateMaintenanceDto): Promise<Maintenance> {
    const maintenance = await this.maintenancesRepository.findOne({
        where: { id },
        relations: ['vehicle']
    });
    if (!maintenance) {
      throw new NotFoundException(`Registro de manutenção com o ID "${id}" não encontrado.`);
    }
    
    // --- REGRA DE NEGÓCIO: MUDA O STATUS DA VIATURA AO CONCLUIR ---
    // Verifica se a 'endDate' está sendo fornecida na atualização e não existia antes.
    if (updateDto.endDate && !maintenance.endDate) {
        maintenance.vehicle.status = VehicleStatus.OPERATIONAL;
        await this.vehiclesRepository.save(maintenance.vehicle);
    }
    
    const { vehicleId, ...maintenanceData } = updateDto;
    const updatedMaintenance = this.maintenancesRepository.merge(maintenance, maintenanceData);

    return this.maintenancesRepository.save(updatedMaintenance);
  }

  async remove(id: string): Promise<void> {
    // Adicionamos soft delete à entidade Maintenance
    const maintenance = await this.findOne(id);

    // Se a manutenção que está sendo deletada era a que mantinha o veículo
    // com status 'EM_MANUTENÇÃO', devemos reverter o status do veículo.
    if (maintenance.vehicle.status === VehicleStatus.IN_MAINTENANCE && !maintenance.endDate) {
        maintenance.vehicle.status = VehicleStatus.OPERATIONAL;
        await this.vehiclesRepository.save(maintenance.vehicle);
    }

    const result = await this.maintenancesRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro de manutenção com o ID "${id}" não encontrado.`);
    }
  }
}