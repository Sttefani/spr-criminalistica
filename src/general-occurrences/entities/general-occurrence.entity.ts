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
  UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne,
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

@Entity('general_occurrences')
export class GeneralOccurrence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  caseNumber: string | null; // TIPO CORRETO

  @ManyToOne(() => Procedure, { nullable: true })
  @JoinColumn({ name: 'procedure_id' })
  procedure: Procedure | null; // TIPO CORRETO

  @Column({ type: 'varchar', nullable: true })
  procedureNumber: string | null; // TIPO CORRETO

  @Column({ type: 'timestamp' })
  occurrenceDate: Date;

  @Column({ type: 'text' })
  history: string;

  @ManyToOne(() => ForensicService)
  @JoinColumn({ name: 'forensic_service_id' })
  forensicService: ForensicService;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'expert_id' })
  responsibleExpert: User | null; // TIPO CORRETO

  @ManyToOne(() => RequestingUnit, { nullable: true })
  @JoinColumn({ name: 'requesting_unit_id' })
  requestingUnit: RequestingUnit | null; // TIPO CORRETO

  @ManyToOne(() => Authority, { nullable: true })
  @JoinColumn({ name: 'requesting_authority_id' })
  requestingAuthority: Authority | null; // TIPO CORRETO

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column({ type: 'enum', enum: OccurrenceStatus, default: OccurrenceStatus.PENDING })
  status: OccurrenceStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @Column({ type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ type: 'jsonb', nullable: true })
  additionalFields: any;

  // --- RELACIONAMENTOS FILHOS ---
  @OneToMany(() => RequestedExam, (requestedExam) => requestedExam.occurrence)
  requestedExams: RequestedExam[];

  @OneToOne(() => TrafficAccidentDetail, (details) => details.occurrence, { nullable: true, cascade: true })
  trafficAccidentDetails: TrafficAccidentDetail | null;
  
  @OneToOne(() => PropertyCrimeDetail, (details) => details.occurrence, { nullable: true, cascade: true })
  propertyCrimeDetails: PropertyCrimeDetail | null;

  @OneToOne(() => CrimeAgainstPersonDetail, (details) => details.occurrence, { nullable: true, cascade: true })
  crimeAgainstPersonDetails: CrimeAgainstPersonDetail | null;

  @OneToOne(() => GeneticComparisonDetail, (details) => details.occurrence, { nullable: true, cascade: true })
  geneticComparisonDetails: GeneticComparisonDetail | null;

  @OneToOne(() => ComputerForensicsDetail, (details) => details.occurrence, { nullable: true, cascade: true })
  computerForensicsDetails: ComputerForensicsDetail | null;
  
  @OneToOne(() => BiologyForensicsDetail, (details) => details.occurrence, { nullable: true, cascade: true })
  biologyForensicsDetails: BiologyForensicsDetail | null;

  @OneToOne(() => BallisticsDetail, (details) => details.occurrence, { nullable: true, cascade: true })
  ballisticsDetails: BallisticsDetail | null;

  @OneToOne(
    () => DocumentoscopyDetail,
    (details) => details.occurrence,
    { nullable: true, cascade: true },
  )
  documentoscopyDetails: DocumentoscopyDetail | null;
  @OneToOne(
    () => VehicleIdentificationDetail,
    (details) => details.occurrence,
    { nullable: true, cascade: true },
  )
  vehicleIdentificationDetails: VehicleIdentificationDetail | null;
  
  @OneToOne(
    () => EnvironmentalCrimeDetail,
    (details) => details.occurrence,
    { nullable: true, cascade: true },
  )
  environmentalCrimeDetails: EnvironmentalCrimeDetail | null;

   @OneToOne(
    () => ChemistryForensicsDetail,
    (details) => details.occurrence,
    { nullable: true, cascade: true },
  )
  chemistryForensicsDetails: ChemistryForensicsDetail | null;
  // --- Colunas de Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}