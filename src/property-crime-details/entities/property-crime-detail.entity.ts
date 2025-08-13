// Arquivo: src/property-crime-details/entities/property-crime-detail.entity.ts

import { Address } from 'src/common/embeddables/address.embeddable';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('property_crime_details')
export class PropertyCrimeDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamento Um-para-Um com a Ocorrência Geral ---
  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // --- Campos Específicos para Crime Contra o Patrimônio ---
  @Column({ type: 'text', nullable: true })
  entryMethod?: string; // Descrição do método de arrombamento/entrada

  @Column({ type: 'jsonb', nullable: true })
  stolenItems?: any[]; // Lista de itens furtados/roubados

  // --- NOVAS FLAGS DE CONTROLE DE FLUXO ---
  @Column({ default: false })
  addressNotFound: boolean; // Flag para "Endereço não localizado"

  @Column({ default: false })
  noOneOnSite: boolean; // Flag para "Ninguém no local"
  // --- FIM DAS NOVAS FLAGS ---

  // --- Controle de Localização ---
  @Column({ default: true })
  isExternalLocation: boolean;
  // --- Controle de Localização ---
  
  // --- Endereço (Reutilizando nossa Embeddable) ---
  // Estes campos só serão preenchidos se isExternalLocation for true.
  @Column(() => Address)
  address: Address;

  // --- Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}