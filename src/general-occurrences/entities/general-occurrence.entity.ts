/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// Arquivo: src/general-occurrences/entities/general-occurrence.entity.ts

import { Authority } from 'src/authorities/entities/authority.entity';
import { City } from 'src/cities/entities/city.entity';
import { ForensicService } from 'src/forensic-services/entities/forensic-service.entity';
import { Procedure } from 'src/procedures/entities/procedure.entity';
import { RequestingUnit } from 'src/requesting-units/entities/requesting-unit.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, Index,
} from 'typeorm';
import { OccurrenceStatus } from '../enums/occurrence-status.enum';
import { RequestedExam } from 'src/requested-exams/entities/requested-exam.entity';
import { TrafficAccidentDetail } from 'src/traffic-accident-details/entities/traffic-accident-detail.entity';
import { PropertyCrimeDetail } from 'src/property-crime-details/entities/property-crime-detail.entity';
import { CrimeAgainstPersonDetail } from 'src/crime-against-person-details/entities/crime-against-person-detail.entity';
import { GeneticComparisonDetail } from 'src/genetic-comparison-details/entities/genetic-comparison-detail.entity';
import { ComputerForensicsDetail } from 'src/computer-forensics-details/entities/computer-forensics-detail.entity';
import { BiologyForensicsDetail } from 'src/biology-forensics-details/entities/biology-forensics-detail.entity';
import { BallisticsDetail } from 'src/ballistics-details/entities/ballistics-detail.entity';
import { DocumentoscopyDetail } from 'src/documentoscopy-details/entities/documentoscopy-detail.entity';
import { VehicleIdentificationDetail } from 'src/vehicle-identification-details/entities/vehicle-identification-detail.entity';
import { EnvironmentalCrimeDetail } from 'src/environmental-crime-details/entities/environmental-crime-detail.entity';
import { ChemistryForensicsDetail } from 'src/chemistry-forensics-details/entities/chemistry-forensics-detail.entity';
import { OccurrenceClassification } from 'src/occurrence-classifications/entities/occurrence-classification.entity';

@Entity('general_occurrences')
@Index('IDX_general_occurrences_occurrence_date', ['occurrenceDate'])
@Index('IDX_general_occurrences_status', ['status'])
@Index('IDX_general_occurrences_case_number', ['caseNumber'])
@Index('IDX_general_occurrences_created_at', ['createdAt'])
export class GeneralOccurrence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ 
    type: 'varchar', 
    unique: true, 
    nullable: true,
    length: 15,
    comment: 'Número do caso gerado automaticamente no formato XXXXXX-YYYY'
  })
  caseNumber: string | null;

  // RELACIONAMENTOS PRINCIPAIS

  @ManyToOne(() => Procedure, { nullable: true })
  @JoinColumn({ name: 'procedure_id' })
  procedure: Procedure | null;

  @Column({ 
    type: 'varchar', 
    nullable: true,
    length: 100,
    comment: 'Número do procedimento informado manualmente'
  })
  procedureNumber: string | null;

  @Column({ 
    type: 'timestamp',
    comment: 'Data e hora da ocorrência'
  })
  occurrenceDate: Date;

  @Column({ 
    type: 'text',
    comment: 'Histórico detalhado da ocorrência'
  })
  history: string;

  @ManyToOne(() => ForensicService, { nullable: false })
  @JoinColumn({ name: 'forensic_service_id' }) // O nome da coluna no banco pode continuar o mesmo
  forensicService: ForensicService; // <-- O NOME DA PROPRIEDADE PADRÃO


  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'responsible_expert_id' })
  responsibleExpert: User | null;

  @ManyToOne(() => RequestingUnit, { nullable: true })
  @JoinColumn({ name: 'requesting_unit_id' })
  requestingUnit: RequestingUnit | null;

  @ManyToOne(() => Authority, { nullable: true })
  @JoinColumn({ name: 'requesting_authority_id' })
  requestingAuthority: Authority | null;

  @ManyToOne(() => City, { nullable: false })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => OccurrenceClassification, { nullable: true })
  @JoinColumn({ name: 'occurrence_classification_id' })
  occurrenceClassification: OccurrenceClassification | null;

  // CAMPOS DE CONTROLE

  @Column({ 
    type: 'enum', 
    enum: OccurrenceStatus, 
    default: OccurrenceStatus.PENDING,
    comment: 'Status atual da ocorrência'
  })
  status: OccurrenceStatus;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @Column({ 
    type: 'boolean', 
    default: false,
    comment: 'Indica se a ocorrência está travada para edição'
  })
  isLocked: boolean;

  @Column({ 
    type: 'jsonb', 
    nullable: true,
    comment: 'Campos adicionais dinâmicos em formato JSON'
  })
  additionalFields: Record<string, any> | null;

  // RELACIONAMENTOS FILHOS (OneToMany)

  @OneToMany(() => RequestedExam, (requestedExam) => requestedExam.occurrence, { 
    cascade: true,
    lazy: true 
  })
  requestedExams: RequestedExam[];

  // RELACIONAMENTOS DE DETALHES ESPECÍFICOS (OneToOne)

  @OneToOne(() => TrafficAccidentDetail, (details) => details.occurrence, { 
    nullable: true, 
    cascade: true,
    lazy: true 
  })
  trafficAccidentDetails: TrafficAccidentDetail | null;
  
  @OneToOne(() => PropertyCrimeDetail, (details) => details.occurrence, { 
    nullable: true, 
    cascade: true,
    lazy: true 
  })
  propertyCrimeDetails: PropertyCrimeDetail | null;

  @OneToOne(() => CrimeAgainstPersonDetail, (details) => details.occurrence, { 
    nullable: true, 
    cascade: true,
    lazy: true 
  })
  crimeAgainstPersonDetails: CrimeAgainstPersonDetail | null;

  @OneToOne(() => GeneticComparisonDetail, (details) => details.occurrence, { 
    nullable: true, 
    cascade: true,
    lazy: true 
  })
  geneticComparisonDetails: GeneticComparisonDetail | null;

  @OneToOne(() => ComputerForensicsDetail, (details) => details.occurrence, { 
    nullable: true, 
    cascade: true,
    lazy: true 
  })
  computerForensicsDetails: ComputerForensicsDetail | null;
  
  @OneToOne(() => BiologyForensicsDetail, (details) => details.occurrence, { 
    nullable: true, 
    cascade: true,
    lazy: true 
  })
  biologyForensicsDetails: BiologyForensicsDetail | null;

  @OneToOne(() => BallisticsDetail, (details) => details.occurrence, { 
    nullable: true, 
    cascade: true,
    lazy: true 
  })
  ballisticsDetails: BallisticsDetail | null;

  @OneToOne(() => DocumentoscopyDetail, (details) => details.occurrence, { 
    nullable: true, 
    cascade: true,
    lazy: true 
  })
  documentoscopyDetails: DocumentoscopyDetail | null;

  @OneToOne(() => VehicleIdentificationDetail, (details) => details.occurrence, { 
    nullable: true, 
    cascade: true,
    lazy: true 
  })
  vehicleIdentificationDetails: VehicleIdentificationDetail | null;
  
  @OneToOne(() => EnvironmentalCrimeDetail, (details) => details.occurrence, { 
    nullable: true, 
    cascade: true,
    lazy: true 
  })
  environmentalCrimeDetails: EnvironmentalCrimeDetail | null;

  @OneToOne(() => ChemistryForensicsDetail, (details) => details.occurrence, { 
    nullable: true, 
    cascade: true,
    lazy: true 
  })
  chemistryForensicsDetails: ChemistryForensicsDetail | null;

  // CAMPOS DE AUDITORIA

  @CreateDateColumn({
    comment: 'Data de criação do registro'
  })
  createdAt: Date;

  @UpdateDateColumn({
    comment: 'Data da última atualização do registro'
  })
  updatedAt: Date;

  @DeleteDateColumn({
    comment: 'Data de exclusão lógica do registro'
  })
  deletedAt: Date | null;

  // MÉTODOS UTILITÁRIOS

  /**
   * Verifica se a ocorrência pode ser editada
   */
  canBeEdited(): boolean {
    return !this.isLocked && !this.deletedAt;
  }

  /**
   * Verifica se a ocorrência está finalizada
   */
  isCompleted(): boolean {
    return this.status === OccurrenceStatus.COMPLETED;
  }

  /**
   * Retorna um resumo da ocorrência para logs
   */
  getSummary(): string {
    return `Ocorrência ${this.caseNumber} - ${this.city?.name} - ${this.status}`;
  }
}