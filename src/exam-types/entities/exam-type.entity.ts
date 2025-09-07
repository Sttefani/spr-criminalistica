/* eslint-disable prettier/prettier */
// Arquivo: src/exam-types/entities/exam-type.entity.ts

import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity('exam_types')
export class ExamType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // Ex: "Exame de Eficiência de Disparo"

  @Column({ unique: true })
  acronym: string; // Ex: "EFI"

  @Column({ type: 'text', nullable: true })
  description: string; // Uma descrição opcional sobre o que é o exame

  @ManyToMany(() => GeneralOccurrence, occurrence => occurrence.examTypes)
   occurrences: GeneralOccurrence[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}