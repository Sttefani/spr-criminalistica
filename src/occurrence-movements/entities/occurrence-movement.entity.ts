/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { GeneralOccurrence } from '../../general-occurrences/entities/general-occurrence.entity';
import { User } from '../../users/entities/users.entity';

@Entity('occurrence_movements')
export class OccurrenceMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  occurrenceId: string;

  @ManyToOne(() => GeneralOccurrence)
  @JoinColumn({ name: 'occurrenceId' })
  occurrence: GeneralOccurrence;

  // Descrição livre da movimentação (como extrato bancário)
  @Column({ type: 'text' })
  description: string;

  // Controle de prazos
  @Column({ type: 'date', nullable: true })
  deadline: Date | null;  // Prazo atual (inicial: 10 dias, pode ser prorrogado)

  @Column({ type: 'date', nullable: true })
  originalDeadline: Date | null;  // Prazo original (sempre 10 dias)

  @Column({ type: 'boolean', default: false })
  isOverdue: boolean;  // Flag vermelha - prazo esgotado

  @Column({ type: 'boolean', default: false })
  isNearDeadline: boolean;  // Flag amarela - prazo próximo

  @Column({ type: 'boolean', default: false })
  wasExtended: boolean;  // Se teve prorrogação

  @Column({ type: 'text', nullable: true })
  extensionJustification: string | null;  // Justificativa da prorrogação

  // Controle da movimentação
  @Column('uuid')
  performedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performedById' })
  performedBy: User;

  @CreateDateColumn({ type: 'timestamp' })
  performedAt: Date;

  @Column({ type: 'boolean', default: false })
  isSystemGenerated: boolean;

  // Campos adicionais flexíveis
  @Column({ type: 'jsonb', nullable: true })
  additionalData: any;

  @DeleteDateColumn()
deletedAt: Date;
}