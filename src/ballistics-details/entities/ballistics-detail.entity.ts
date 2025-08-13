// Arquivo: src/ballistics-details/entities/ballistics-detail.entity.ts

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

@Entity('ballistics_details')
export class BallisticsDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Relacionamento Um-para-Um com a Ocorrência Geral ---
  @OneToOne(() => GeneralOccurrence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'occurrence_id' })
  occurrence: GeneralOccurrence;

  // --- Campos Específicos para Balística ---

  @Column({ type: 'jsonb' })
  // Armazena uma lista de todos os itens recebidos.
  items: any[];
  // Exemplo de JSON:
  // [
  //   { "type": "Arma de Fogo", "category": "Pistola", "brand": "Taurus", "model": "G2C", "caliber": ".40", "serial": "XYZ123" },
  //   { "type": "Munição", "category": "Cartucho", "caliber": ".40", "quantity": 12 },
  //   { "type": "Projétil", "description": "Projétil de chumbo deformado", "collectedFrom": "Corpo da vítima" },
  //   { "type": "Estojo", "caliber": ".40", "quantity": 3, "collectedFrom": "Cena do crime" }
  // ]

  @Column({ nullable: true })
  sinabRegistration?: string; // Campo para o número de registro no SINAB

  // --- RELACIONAMENTO COM OS TIPOS DE EXAME ---
  @ManyToMany(() => ExamType)
  @JoinTable({
    name: 'ballistics_details_exam_types', // Tabela de junção
    joinColumn: { name: 'ballistics_detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'exam_type_id', referencedColumnName: 'id' },
  })
  examsPerformed: ExamType[];
  // Ex: O perito selecionaria "Exame de Eficiência em Arma de Fogo", "Confronto Microbalístico", etc.
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