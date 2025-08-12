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
  // A cidade e outros dados gerais são herdados daqui.
  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // --- Endereço Estruturado ---
  @Column()
  street: string; // Ex: "Avenida Paulista"

  @Column({ nullable: true })
  number?: string; // Ex: "1578" ou "s/n"

  @Column()
  neighborhood: string; // Ex: "Bela Vista"

  @Column({ nullable: true })
  zipCode?: string; // CEP, Ex: "01310-200"

  @Column({ type: 'text', nullable: true })
  referencePoint?: string; // Ex: "Próximo ao MASP"

  // --- Geolocalização (Ideal para integração com mapas) ---
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number; // Ex: -23.56135

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number; // Ex: -46.65653

  // --- Dados Dinâmicos ---
  // JSONB é perfeito para armazenar listas de objetos com estrutura flexível.
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
