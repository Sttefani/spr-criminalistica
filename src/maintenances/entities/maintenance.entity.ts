// Arquivo: src/maintenances/entities/maintenance.entity.ts

import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { MaintenanceType } from '../enums/maintenance-type.enum';
import { MalfunctionReport } from 'src/malfunction-reports/entities/malfunction-report.entity';

@Entity('maintenances')
export class Maintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamentos ---
  @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  // --- Dados da Manutenção ---
  @Column()
  serviceProvider: string; // Oficina ou prestador de serviço

  @Column({ type: 'timestamp' })
  startDate: Date; // Data de início

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null; // Data de conclusão

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number; // Custo do serviço

  @Column({ type: 'text' })
  description: string; // Descrição do serviço realizado

  @Column({ type: 'enum', enum: MaintenanceType })
  type: MaintenanceType;

  @Column({ type: 'jsonb', nullable: true })
  additionalFields?: any;
  // Exemplo para Troca de Óleo: { "oleo_utilizado": "5w30 Sintético", "filtro_trocado": true, "proxima_troca_km": 85000 }
  // Exemplo para Pneus: { "pneus_trocados": ["Dianteiro Esquerdo", "Dianteiro Direito"], "marca_pneu": "Pirelli" }
  // --- FIM DO NOVO CAMPO ---

  @OneToOne(() => MalfunctionReport, (report) => report.relatedMaintenance, { nullable: true })
  resolvesMalfunctionReport: MalfunctionReport | null;
  // --- Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}