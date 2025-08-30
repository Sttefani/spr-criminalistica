/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index, // <-- 1. Importe o 'Index'
} from 'typeorm';

@Entity('occurrence_classifications')
// ==========================================================
// 2. ADICIONE OS ÍNDICES PARCIAIS AQUI
// ==========================================================
@Index(['name', 'deletedAt'], { unique: true, where: '"deletedAt" IS NULL' })
@Index(['code', 'deletedAt'], { unique: true, where: '"deletedAt" IS NULL' })
export class OccurrenceClassification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ==========================================================
  // 3. REMOVA a unicidade de dentro da coluna
  // ==========================================================
  @Column() // <-- Remova { unique: true }
  code: string;

  @Column() // <-- Remova { unique: true }
  name: string;

  @Column({ nullable: true })
  group: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}