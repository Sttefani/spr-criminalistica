// Arquivo: src/definitive-drug-tests/entities/definitive-drug-test.entity.ts
import { ExamType } from 'src/exam-types/entities/exam-type.entity'; // 1. IMPORTE
import { PreliminaryDrugTest } from 'src/preliminary-drug-tests/entities/preliminary-drug-test.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  ManyToMany, 
  JoinTable,
} from 'typeorm';

@Entity('definitive_drug_tests')
export class DefinitiveDrugTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'text' })
  analysisResult: string;

  @Column({ unique: true, nullable: true }) // Será gerado pelo serviço
  reportNumber?: string; // Ex: "QUIM-150-2025"

  // --- Relacionamento Um-para-Um com o Exame Preliminar ---
  @OneToOne(() => PreliminaryDrugTest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'preliminary_test_id' })
  preliminaryTest: PreliminaryDrugTest;

  // --- Dados específicos do Exame Definitivo ---
  @ManyToOne(() => User)
  @JoinColumn({ name: 'expert_id' })
  expert: User; // O perito do laboratório que fez este exame

  // --- NOVOS CAMPOS PARA CONTROLE DE EDIÇÃO ---
  @Column({ type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lockedAt?: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'locked_by_user_id' })
  lockedBy?: User; // O usuário (autoridade) que causou o travamento
  // --- FIM DOS NOVOS CAMPOS ---

  @ManyToMany(() => ExamType)
  @JoinTable({
    name: 'definitive_tests_exam_types', // Nome da nova tabela de junção
    joinColumn: { name: 'definitive_test_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'exam_type_id', referencedColumnName: 'id' },
  })
  techniquesUsed: ExamType[];
  
  // --- Auditoria ---
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}