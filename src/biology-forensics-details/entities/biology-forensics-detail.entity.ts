// Arquivo: src/biology-forensics-details/entities/biology-forensics-detail.entity.ts
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

@Entity('biology_forensics_details')
export class BiologyForensicsDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamento Um-para-Um com a Ocorrência Geral ---
  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // --- Campos Específicos para Biologia Forense ---

  @Column({ type: 'jsonb' })
  vestiges: any[];

  // --- RELACIONAMENTO COM OS TIPOS DE EXAME (CORRIGIDO) ---
  @ManyToMany(() => ExamType)
  @JoinTable({
    name: 'biology_details_exam_types', // Tabela de junção
    joinColumn: { name: 'biology_detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'exam_type_id', referencedColumnName: 'id' },
  })
  examsPerformed: ExamType[];
  // --- FIM DO RELACIONAMENTO ---

  @Column({ type: 'text', nullable: true })
  generalObservations?: string;

  // --- Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}