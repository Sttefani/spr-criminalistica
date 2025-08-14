// Arquivo: src/documentoscopy-details/entities/documentoscopy-detail.entity.ts

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

@Entity('documentoscopy_details')
export class DocumentoscopyDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamento Um-para-Um com a Ocorrência Geral ---
  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // --- Campos Específicos para Documentoscopia ---

  @Column({ type: 'jsonb' })
  // Armazena uma lista de todos os itens recebidos para análise.
  questionedItems: any[];
  // Exemplo de JSON:
  // [
  //   { "type": "Documento de Identidade", "description": "RG em nome de João da Silva, suspeita de adulteração na foto" },
  //   { "type": "Cédula de Dinheiro", "value": "R$ 100,00", "serial": "XYZ123456", "suspicion": "Suspeita de contrafação" },
  //   { "type": "Contrato", "description": "Contrato de aluguel com assinatura questionada" }
  // ]
  @Column({ type: 'jsonb', nullable: true })
  additionalFields?: any;
  
  // --- RELACIONAMENTO COM OS TIPOS DE EXAME (OBRIGATÓRIO) ---
  @ManyToMany(() => ExamType)
  @JoinTable({
    name: 'documentoscopy_details_exam_types',
    joinColumn: { name: 'documentoscopy_detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'exam_type_id', referencedColumnName: 'id' },
  })
  examsPerformed: ExamType[];
  // Ex: O perito selecionaria "Exame Grafotécnico", "Análise de Autenticidade de Documento", etc.
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