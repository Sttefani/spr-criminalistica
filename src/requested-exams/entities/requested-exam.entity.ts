// Arquivo: src/requested-exams/entities/requested-exam.entity.ts

import { ExamType } from 'src/exam-types/entities/exam-type.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Enum para o status de cada exame solicitado
export enum RequestedExamStatus {
  PENDING = 'SOLICITADO',
  IN_PROGRESS = 'EM_ANDAMENTO',
  COMPLETED = 'CONCLUIDO',
  CANCELED = 'CANCELADO',
}

@Entity('requested_exams')
export class RequestedExam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamentos Principais ---

  // Muitos exames solicitados pertencem a uma Ocorrência Geral.
  @ManyToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // Muitos exames solicitados podem ser do mesmo Tipo de Exame.
  @ManyToOne(() => ExamType)
  @JoinColumn({ name: 'exam_type_id' })
  examType: ExamType;

  // --- Controle de Status e Atribuição ---
  @Column({
    type: 'enum',
    enum: RequestedExamStatus,
    default: RequestedExamStatus.PENDING,
  })
  status: RequestedExamStatus;
  
  // O perito específico que está realizando ESTE exame (pode ser diferente do perito geral da ocorrência).
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'expert_id' })
  assignedExpert?: User;

  // --- Auditoria ---
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}