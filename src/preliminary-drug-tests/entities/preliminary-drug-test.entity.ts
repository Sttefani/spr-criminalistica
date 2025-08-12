// Arquivo: src/preliminary-drug-tests/entities/preliminary-drug-test.entity.ts
import { ForensicService } from 'src/forensic-services/entities/forensic-service.entity'; // Importe a entidade
import { Authority } from 'src/authorities/entities/authority.entity';
import { City } from 'src/cities/entities/city.entity';
import { OccurrenceClassification } from 'src/occurrence-classifications/entities/occurrence-classification.entity';
import { Procedure } from 'src/procedures/entities/procedure.entity';
import { RequestingUnit } from 'src/requesting-units/entities/requesting-unit.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Criamos um Enum para os status do caso, para evitar erros de digitação.
export enum CaseStatus {
  PRELIMINARY_DONE = 'PRELIMINAR_CONCLUIDO',
  IN_LAB_ANALYSIS = 'EM_ANALISE_LABORATORIAL',
  DEFINITIVE_DONE = 'DEFINITIVO_CONCLUIDO',
}

@Entity('preliminary_drug_tests')
export class PreliminaryDrugTest {
  // --- Identificadores ---
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  caseNumber?: string;

  // --- Relacionamentos Principais ---
  @ManyToOne(() => Procedure)
  @JoinColumn({ name: 'procedure_id' })
  procedure: Procedure;

  @Column()
  procedureNumber: string;

  @ManyToOne(() => OccurrenceClassification)
  @JoinColumn({ name: 'occurrence_classification_id' })
  occurrenceClassification: OccurrenceClassification;

  // --- Envolvidos ---
  @ManyToOne(() => User)
  @JoinColumn({ name: 'expert_id' })
  responsibleExpert: User;

  @ManyToOne(() => RequestingUnit)
  @JoinColumn({ name: 'requesting_unit_id' })
  requestingUnit: RequestingUnit;

  @ManyToOne(() => Authority)
  @JoinColumn({ name: 'requesting_authority_id' })
  requestingAuthority: Authority;

  // --- Localidade ---
  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  // --- Dados da Substância ---
  @Column({ type: 'text' })
  substanceDescription: string;

  @Column()
  sealIn: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  grossWeight: number;
  
  // --- Dados de Saída e Contraprova ---
  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  counterproofWeight?: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  netWeight?: number;

  @Column()
  sealOut: string;

  @Column({ nullable: true })
  labSeal?: string;

  // --- Laudo Preliminar ---
  @Column({ nullable: true })
  reportUrl?: string;

  // --- NOVOS CAMPOS PARA O FLUXO COMPLETO ---

  @Column({
    type: 'enum',
    enum: CaseStatus,
    default: CaseStatus.PRELIMINARY_DONE,
  })
  caseStatus: CaseStatus;

  @ManyToOne(() => ForensicService, { nullable: true })
  @JoinColumn({ name: 'definitive_service_id' })
  definitiveService?: ForensicService;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'definitive_expert_id' })
  definitiveExpert?: User;

  @Column({ nullable: true })
  definitiveReportUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  definitiveReportDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  authorityReceivedAt?: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'authority_received_by_id' })
  authorityReceivedBy?: User;

  // --- Controle de Edição ---
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @Column({ type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lockedAt?: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'locked_by_user_id' })
  lockedBy?: User;

  // --- Colunas de Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}