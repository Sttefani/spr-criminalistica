// Arquivo: src/crime-against-person-details/entities/crime-against-person-detail.entity.ts

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

@Entity('crime_against_person_details')
export class CrimeAgainstPersonDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamento Um-para-Um com a Ocorrência Geral ---
  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // --- Endereço (Reutilizando nossa Embeddable) ---
  @Column(() => Address)
  address: Address;

  // --- Campos Específicos para Crime Contra a Pessoa ---
  @Column({ type: 'jsonb', nullable: true })
  victimDetails?: any[]; // Ex: [{ "nome": "Nome", "condicao": "óbito", "posicao": "decúbito dorsal" }]

  @Column({ type: 'text', nullable: true })
  crimeWeapon?: string; // Descrição da arma do crime

  @Column({ type: 'jsonb', nullable: true })
  evidenceCollected?: any[]; // Ex: [{ "item": "Estojo", "quantidade": 3, "lacre": "L-123" }]

  @Column({ type: 'text', nullable: true })
  sceneDescription?: string; // Descrição detalhada da cena do crime

  // --- Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}