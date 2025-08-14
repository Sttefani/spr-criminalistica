// Arquivo: src/vehicle-identification-details/entities/vehicle-identification-detail.entity.ts

import { Address } from 'src/common/embeddables/address.embeddable';
import { ExamType } from 'src/exam-types/entities/exam-type.entity';
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
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('vehicle_identification_details')
export class VehicleIdentificationDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamento Um-para-Um com a Ocorrência Geral ---
  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // --- Campos Específicos para Identificação Veicular ---

  @Column({ type: 'jsonb' })
  vehicleDetails: any; // Ex: { "type": "Automóvel", "plate": "BRA2E19", "chassis": "9BW..." }

  @Column({ default: true })
  isExternalLocation: boolean; // true = perícia no local, false = no pátio do instituto

  @Column(() => Address)
  address: Address; // Endereço da perícia (se for externa)

  // --- RELACIONAMENTO COM OS TIPOS DE EXAME ---
  @ManyToMany(() => ExamType)
  @JoinTable({
    name: 'vehicle_details_exam_types',
    joinColumn: { name: 'vehicle_detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'exam_type_id', referencedColumnName: 'id' },
  })
  examsPerformed: ExamType[];

  @Column({ type: 'jsonb', nullable: true })
  additionalFields?: any;

  // --- Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}