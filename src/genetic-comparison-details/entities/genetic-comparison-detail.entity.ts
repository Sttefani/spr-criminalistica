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

@Entity('genetic_comparison_details')
export class GeneticComparisonDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamento Um-para-Um com a Ocorrência Geral ---
  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // --- Campos Específicos para Comparação Genética ---

  // O campo 'samples' agora é mais simples, pois os detalhes do tipo de exame vêm do relacionamento
  @Column({ type: 'jsonb' })
  samples: any[]; // Ex: [{ "id": "AMOSTRA-01", "source": "Vítima A" }, { "id": "AMOSTRA-02", "source": "Suspeito B" }]

  @Column({ type: 'text', nullable: true })
  comparisonObjective?: string;

  // --- RELACIONAMENTO COM OS TIPOS DE EXAME (SUA SUGESTÃO) ---
  @ManyToMany(() => ExamType)
  @JoinTable({
    name: 'genetic_details_exam_types', // Nome da nova tabela de junção
    joinColumn: { name: 'genetic_detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'exam_type_id', referencedColumnName: 'id' },
  })
  examsPerformed: ExamType[];
  // --- FIM DO RELACIONAMENTO ---

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