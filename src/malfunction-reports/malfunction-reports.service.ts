// Arquivo: src/malfunction-reports/malfunction-reports.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMalfunctionReportDto } from './dto/create-malfunction-report.dto';
import { UpdateMalfunctionReportDto } from './dto/update-malfunction-report.dto';
import { MalfunctionReport } from './entities/malfunction-report.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { User } from 'src/users/entities/users.entity';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';
import { ReportStatus } from './enums/report-status.enum';

@Injectable()
export class MalfunctionReportsService {
  constructor(
    @InjectRepository(MalfunctionReport)
    private reportsRepository: Repository<MalfunctionReport>,
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(Maintenance)
    private maintenancesRepository: Repository<Maintenance>,
  ) {}

  async create(createDto: CreateMalfunctionReportDto, reportingUser: User): Promise<MalfunctionReport> {
    const { vehicleId, ...reportData } = createDto;

    const vehicle = await this.vehiclesRepository.findOneBy({ id: vehicleId });
    if (!vehicle) {
      throw new NotFoundException(`Viatura com o ID "${vehicleId}" não encontrada.`);
    }

    const newReport = this.reportsRepository.create({
      ...reportData,
      vehicle,
      reportingUser,
    });

    return this.reportsRepository.save(newReport);
  }

  async findAllByVehicle(vehicleId: string): Promise<MalfunctionReport[]> {
    return this.reportsRepository.find({
      where: { vehicle: { id: vehicleId } },
      relations: ['reportingUser', 'relatedMaintenance'],
      order: { reportDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<MalfunctionReport> {
    const report = await this.reportsRepository.findOne({
      where: { id },
      relations: ['vehicle', 'reportingUser', 'relatedMaintenance'],
    });
    if (!report) {
      throw new NotFoundException(`Registro de pane com o ID "${id}" não encontrado.`);
    }
    return report;
  }

  async update(id: string, updateDto: UpdateMalfunctionReportDto): Promise<MalfunctionReport> {
    const { relatedMaintenanceId, ...reportData } = updateDto;
    
    const report = await this.reportsRepository.preload({
      id: id,
      ...reportData,
    });

    if (!report) {
      throw new NotFoundException(`Registro de pane com o ID "${id}" não encontrado.`);
    }

    if (relatedMaintenanceId) {
      const maintenance = await this.maintenancesRepository.findOneBy({ id: relatedMaintenanceId });
      if (!maintenance) {
        throw new NotFoundException(`Manutenção com o ID "${relatedMaintenanceId}" não encontrada.`);
      }
      report.relatedMaintenance = maintenance;
      // Ao vincular uma manutenção, automaticamente resolvemos o problema
      report.status = ReportStatus.RESOLVED;
    }

    return this.reportsRepository.save(report);
  }

  async remove(id: string): Promise<void> {
    // Registros de pane são eventos, então usamos delete real.
    const result = await this.reportsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro de pane com o ID "${id}" não encontrado.`);
    }
  }
}
