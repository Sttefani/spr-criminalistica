// Arquivo: src/traffic-accident-details/entities/traffic-accident-detail.entity.ts

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

@Entity('traffic_accident_details')
export class TrafficAccidentDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamento Um-para-Um com a Ocorrência Geral ---
  // Cada registro de detalhe pertence a uma única ocorrência.
  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // --- Campos Específicos para Acidente de Trânsito ---
  @Column({ type: 'text' })
  address: string; // Endereço completo do acidente

  // Para 'veículos' e 'vítimas', usar JSON é a forma mais flexível
  // de armazenar listas de objetos com estruturas variáveis.
  @Column({ type: 'jsonb', nullable: true })
  involvedVehicles?: any[]; // Ex: [{ "placa": "ABC1234", "modelo": "Gol", "danos": "..." }]

  @Column({ type: 'jsonb', nullable: true })
  victims?: any[]; // Ex: [{ "nome": "João Silva", "lesao": "Leve", "veiculo": "ABC1234" }]

  // --- Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}