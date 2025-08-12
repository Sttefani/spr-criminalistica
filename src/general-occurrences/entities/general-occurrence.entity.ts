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

@Entity('general_occurrences')
export class GeneralOccurrence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  caseNumber: string;

  // --- Dados do Procedimento (Opcionais no início) ---
  @ManyToOne(() => Procedure, { nullable: true })
  @JoinColumn({ name: 'procedure_id' })
  procedure: Procedure | null;

  @Column({ nullable: true })
  procedureNumber: string;

  // --- Datas e Descrições (Obrigatórios) ---
  @Column({ type: 'timestamp' })
  occurrenceDate: Date;

  @Column({ type: 'text' })
  history: string;

  // --- Relacionamentos de Atribuição (Serviço é obrigatório, Perito opcional) ---
  @ManyToOne(() => ForensicService)
  @JoinColumn({ name: 'forensic_service_id' })
  forensicService: ForensicService;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'expert_id' })
  responsibleExpert: User | null;

  // --- Relacionamentos de Origem (Opcionais no início) ---
  @ManyToOne(() => RequestingUnit, { nullable: true })
  @JoinColumn({ name: 'requesting_unit_id' })
  requestingUnit: RequestingUnit | null;

  @ManyToOne(() => Authority, { nullable: true })
  @JoinColumn({ name: 'requesting_authority_id' })
  requestingAuthority: Authority | null;

  // --- Localidade (Obrigatória) ---
  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  // --- Controle de Status e Edição ---
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

  // --- Relacionamentos Filhos ---
  @OneToMany(() => RequestedExam, (requestedExam) => requestedExam.occurrence)
  requestedExams: RequestedExam[];

  @OneToOne(() => TrafficAccidentDetail, (details) => details.occurrence, { nullable: true, cascade: true })
  trafficAccidentDetails: TrafficAccidentDetail | null;

  // --- Colunas de Auditoria ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}