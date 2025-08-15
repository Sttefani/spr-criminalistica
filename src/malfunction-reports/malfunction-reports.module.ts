// Arquivo: src/malfunction-reports/malfunction-reports.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MalfunctionReportsService } from './malfunction-reports.service';
import { MalfunctionReportsController } from './malfunction-reports.controller';
import { MalfunctionReport } from './entities/malfunction-report.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';
import { User } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MalfunctionReport,
      Vehicle,
      Maintenance,
      User,
    ]),
  ],
  controllers: [MalfunctionReportsController],
  providers: [MalfunctionReportsService],
})
export class MalfunctionReportsModule {}