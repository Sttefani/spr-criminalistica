// Arquivo: src/patrimony-movements/entities/patrimony-movement.entity.ts

import { Location } from 'src/locations/entities/location.entity';
import { PatrimonyItem } from 'src/patrimony-items/entities/patrimony-item.entity';
import { User } from 'src/users/entities/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum MovementType {
  CREATION = 'CRIAÇÃO', // Registro inicial
  TRANSFER = 'TRANSFERENCIA', // Movimentação entre locais/usuários
  MAINTENANCE_START = 'INICIO_MANUTENCAO',
  MAINTENANCE_END = 'FIM_MANUTENCAO',
  RETIREMENT = 'BAIXA_PATRIMONIAL', // Alienado, baixado
}

@Entity('patrimony_movements')
export class PatrimonyMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Qual item foi movimentado ---
  @ManyToOne(() => PatrimonyItem, (item) => item.movements)
  @JoinColumn({ name: 'patrimony_item_id' })
  patrimonyItem: PatrimonyItem;

  // --- Detalhes da Transação ---
  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  @Column({ type: 'text', nullable: true })
  notes?: string; // Observações (ex: "Enviado para conserto", "Transferido para novo setor")

  // --- Origem (pode ser nula na criação) ---
  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'from_location_id' })
  fromLocation: Location | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'from_user_id' })
  fromUser: User | null;

  // --- Destino (pode ser nulo na baixa) ---
  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'to_location_id' })
  toLocation: Location | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'to_user_id' })
  toUser: User | null;

  // --- Auditoria da Movimentação ---
  @ManyToOne(() => User)
  @JoinColumn({ name: 'responsible_admin_id' })
  responsibleAdmin: User; // O admin que registrou a movimentação

  @CreateDateColumn()
  movementDate: Date;
}