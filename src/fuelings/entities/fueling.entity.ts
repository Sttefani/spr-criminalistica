// Arquivo: src/fuelings/entities/fueling.entity.ts

import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('fuelings')
export class Fueling {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamentos ---
  @ManyToOne(() => Vehicle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User; // O usuário que registrou o abastecimento

  // --- Dados do Abastecimento ---
  @Column({ type: 'timestamp' })
  date: Date; // Data e hora do abastecimento

  @Column({ type: 'int' })
  mileage: number; // A quilometragem ATUAL da viatura

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  liters: number; // Litros abastecidos

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalCost: number; // Custo total em R$

  @Column()
  gasStation: string; // Nome do posto de combustível

  // --- Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

@DeleteDateColumn() // <-- ADICIONE AQUI
  deletedAt: Date;
}
