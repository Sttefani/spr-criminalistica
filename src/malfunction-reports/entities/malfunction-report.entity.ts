// Arquivo: src/malfunction-reports/entities/malfunction-report.entity.ts

import { Maintenance } from 'src/maintenances/entities/maintenance.entity';
import { User } from 'src/users/entities/users.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ReportStatus } from '../enums/report-status.enum';

@Entity('malfunction_reports')
export class MalfunctionReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamentos ---
  @ManyToOne(() => Vehicle, { onDelete: 'SET NULL' }) // Se a viatura for deletada, o registro de pane não some
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporting_user_id' })
  reportingUser: User; // Quem reportou o problema

  // --- Dados do Registro ---
  @Column({ type: 'timestamp' })
  reportDate: Date; // Data em que o problema foi notado/reportado

  @Column({ type: 'text' })
  description: string; // Descrição detalhada do problema

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.OPEN })
  status: ReportStatus;

  // Relacionamento opcional com a manutenção que resolveu este problema
  @OneToOne(() => Maintenance, { nullable: true })
  @JoinColumn({ name: 'related_maintenance_id' })
  relatedMaintenance: Maintenance | null;

  // --- Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}