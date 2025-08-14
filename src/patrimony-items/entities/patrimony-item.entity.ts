// Arquivo: src/patrimony-items/entities/patrimony-item.entity.ts

import { Document } from 'src/documents/entities/document.entity';
import { Location } from 'src/locations/entities/location.entity';
import { PatrimonySubcategory } from 'src/patrimony-classifications/entities/patrimony-subcategory.entity';
import { PatrimonyMovement } from 'src/patrimony-movements/entities/patrimony-movement.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { AcquisitionType } from '../enums/acquisition-type.enum';
import { ItemState } from '../enums/item-state.enum';
import { ItemOperationalStatus } from '../enums/item-operational-status.enum';

@Entity('patrimony_items')
export class PatrimonyItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // O campo 'name' foi removido. A descrição agora é o identificador textual principal.
  @Column({ type: 'text' })
  description: string;

  // --- RELACIONAMENTO COM A CLASSIFICAÇÃO ---
  @ManyToOne(() => PatrimonySubcategory, { eager: true })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: PatrimonySubcategory;
  // --- FIM DO RELACIONAMENTO ---

  @Column({ type: 'varchar', unique: true, nullable: true })
  tombNumber: string | null;

  @Column({ type: 'enum', enum: AcquisitionType })
  acquisitionType: AcquisitionType;

  @Column({ type: 'varchar', nullable: true })
  invoiceNumber: string | null;

  @Column({ type: 'enum', enum: ItemState, default: ItemState.BOM })
  state: ItemState;

  @Column({ type: 'enum', enum: ItemOperationalStatus, default: ItemOperationalStatus.OPERATIONAL })
  operationalStatus: ItemOperationalStatus;

  // --- Relacionamentos de Localização e Posse ---
  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'current_holder_id' })
  currentHolder: User | null;

  @ManyToOne(() => Location, { eager: true })
  @JoinColumn({ name: 'current_location_id' })
  currentLocation: Location;

  // --- Relacionamentos Filhos ---
  @OneToMany(() => Document, (document) => document.patrimonyItem)
  documents: Document[];

  @OneToMany(() => PatrimonyMovement, (movement) => movement.patrimonyItem)
  movements: PatrimonyMovement[];

  // --- Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}