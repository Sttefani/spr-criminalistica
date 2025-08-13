// Arquivo: src/traffic-accident-details/entities/traffic-accident-detail.entity.ts

import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn,
} from 'typeorm';
import { Address } from 'src/common/embeddables/address.embeddable'; // Importa nossa Embeddable

@Entity('traffic_accident_details')
export class TrafficAccidentDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // --- CAMPO DE ENDEREÇO CORRETO ---
  @Column(() => Address) // Diz ao TypeORM para embutir as colunas da classe Address aqui
  address: Address;
  // --- FIM DO CAMPO ---

  @Column({ type: 'jsonb', nullable: true })
  involvedVehicles?: any[];

  @Column({ type: 'jsonb', nullable: true })
  victims?: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}