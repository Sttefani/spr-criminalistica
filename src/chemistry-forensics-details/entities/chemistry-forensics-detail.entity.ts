// Arquivo: src/chemistry-forensics-details/entities/chemistry-forensics-detail.entity.ts

import { ExamType } from 'src/exam-types/entities/exam-type.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  DeleteDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable,
} from 'typeorm';

@Entity('chemistry_forensics_details')
export class ChemistryForensicsDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  @Column({ type: 'jsonb' })
  vestiges: any[];
  // Ex: [{ "id": "AMOSTRA-A", "description": "Galão com líquido amarelo, odor de gasolina" },
  //      { "id": "AMOSTRA-B", "description": "Fragmento de víscera (fígado)" }]

  @Column({ type: 'jsonb', nullable: true })
  additionalFields?: any;

  @ManyToMany(() => ExamType)
  @JoinTable({
    name: 'chemistry_details_exam_types',
    joinColumn: { name: 'chemistry_detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'exam_type_id', referencedColumnName: 'id' },
  })
  examsPerformed: ExamType[];
  // Ex: "Análise de Adulteração de Combustível", "Pesquisa de Agrotóxicos", "Análise Toxicológica"

  @Column({ type: 'text', nullable: true })
  generalObservations?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
