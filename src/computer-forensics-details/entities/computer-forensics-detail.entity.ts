// Arquivo: src/computer-forensics-details/entities/computer-forensics-detail.entity.ts

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

@Entity('computer_forensics_details')
export class ComputerForensicsDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => GeneralOccurrence)
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  @Column({ type: 'jsonb' })
  equipment: any[];

  @Column({ type: 'text', nullable: true })
  generalObservations?: string;

  // --- RELACIONAMENTO COM OS TIPOS DE EXAME (COMO VOCÊ SUGERIU) ---
  @ManyToMany(() => ExamType)
  @JoinTable({
    name: 'computer_forensics_details_exam_types', // Tabela de junção
    joinColumn: { name: 'computer_forensics_detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'exam_type_id', referencedColumnName: 'id' },
  })
  examsPerformed: ExamType[];
  // --- FIM DO RELACIONAMENTO ---

  // ... colunas de auditoria
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}