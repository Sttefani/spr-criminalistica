// Arquivo: src/vehicles/entities/vehicle.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { VehicleType } from '../enums/vehicle-type.enum';
import { VehicleStatus } from '../enums/vehicle-status.enum';
import { Fueling } from 'src/fuelings/entities/fueling.entity';
import { Maintenance } from 'src/maintenances/entities/maintenance.entity';
import { MalfunctionReport } from 'src/malfunction-reports/entities/malfunction-report.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  plate: string; // Placa

  @Column()
  brand: string; // Marca

  @Column()
  model: string; // Modelo

  @Column({ type: 'int' })
  year: number; // Ano

  @Column({ type: 'enum', enum: VehicleType })
  type: VehicleType;

@Column({ type: 'varchar', unique: true, nullable: true })
  renavam: string | null;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.OPERATIONAL,
  })
  status: VehicleStatus;

  @Column({ type: 'int' })
  initialMileage: number; // Quilometragem inicial de cadastro

  @Column({ type: 'jsonb', nullable: true })
  additionalFields: any;
  
   // --- RELACIONAMENTO COM OS REGISTROS DE ABASTECIMENTO ---
  @OneToMany(() => Fueling, (fueling) => fueling.vehicle)
  fuelings: Fueling[];
  // Os relacionamentos com VehicleLog, Fueling, etc. serão do tipo OneToMany
  // e serão adicionados aqui quando criarmos as outras entidades.

  // --- RELACIONAMENTO COM OS REGISTROS DE MANUTENÇÃO ---
  @OneToMany(() => Maintenance, (maintenance) => maintenance.vehicle)
  maintenances: Maintenance[];
  // --- FIM DO RELACIONAMENTO -

  @OneToMany(() => MalfunctionReport, (report) => report.vehicle)
  malfunctionReports: MalfunctionReport[];
  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}