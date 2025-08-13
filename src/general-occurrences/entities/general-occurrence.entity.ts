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

@Entity('general_occurrences')
export class GeneralOccurrence {
  @PrimaryGeneratedColumn('uuid')
  id: string 

  @Column({ type: 'varchar', unique: true, nullable: false })
  caseNumber: string 

  @ManyToOne(() => Procedure, { nullable: true })
  @JoinColumn({ name: 'procedure_id' })
  procedure: Procedure 

  @Column({ nullable: true })
  procedureNumber: string 

  @Column({ type: 'timestamp' })
  occurrenceDate: Date;

  @Column({ type: 'text' })
  history: string;

  @ManyToOne(() => ForensicService)
  @JoinColumn({ name: 'forensic_service_id' })
  forensicService: ForensicService;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'expert_id' })
  responsibleExpert: User 

  @ManyToOne(() => RequestingUnit, { nullable: true })
  @JoinColumn({ name: 'requesting_unit_id' })
  requestingUnit: RequestingUnit 

  @ManyToOne(() => Authority, { nullable: true })
  @JoinColumn({ name: 'requesting_authority_id' })
  requestingAuthority: Authority 

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column({
    type: 'enum',
    enum: OccurrenceStatus,
    default: OccurrenceStatus.PENDING,
  })
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

  // --- Colunas de Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}