// Arquivo: src/environmental-crime-details/entities/environmental-crime-detail.entity.ts

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

// Enum para os tipos de dano (opcional, mas bom para estatísticas)
export enum DamageType {
  DEFORESTATION = 'DESMATAMENTO',
  FIRE = 'INCÊNDIO_DANOS', 
  WATER_POLLUTION = 'POLUICAO_HIDRICA',
  ANIMAL_ABUSE = 'MAUS_TRATOS_ANIMAL',
  ILLEGAL_MINING = 'EXTRACAO_MINERAL_ILEGAL',
  LAND_INVASION = 'INVASAO_DE_TERRA',
  OILS = ' COMBUSTÍVEL ADULTERADO',
  OTHER = 'OUTRO',
}

@Entity('environmental_crime_details')
export class EnvironmentalCrimeDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamento Um-para-Um com a Ocorrência Geral ---
  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // --- Campos Específicos para Crime Ambiental ---

  @Column({ type: 'text' })
  areaDescription: string;

  @Column({ type: 'enum', enum: DamageType, nullable: true })
  mainDamageType?: DamageType;

  @Column({ default: false })
  isAreaExtensive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  pointsOfInterest?: any[];

  // --- RELACIONAMENTO COM OS TIPOS DE EXAME ---
  @ManyToMany(() => ExamType)
  @JoinTable({
    name: 'environmental_details_exam_types',
    joinColumn: { name: 'environmental_detail_id', referencedColumnName: 'id' },
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