import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DocumentType } from '../enums/document-type.enum';
import { User } from 'src/users/entities/users.entity';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { PreliminaryDrugTest } from 'src/preliminary-drug-tests/entities/preliminary-drug-test.entity';
import { DefinitiveDrugTest } from 'src/definitive-drug-tests/entities/definitive-drug-test.entity';
import { PatrimonyItem } from 'src/patrimony-items/entities/patrimony-item.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column({ unique: true })
  storageKey: string;

  @Column()
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  // --- RELACIONAMENTOS "PAI" (APENAS UM DELES SERÁ PREENCHIDO) ---

  @ManyToOne(() => GeneralOccurrence, { nullable: true })
  @JoinColumn({ name: 'general_occurrence_id' })
  generalOccurrence: GeneralOccurrence | null;

  @ManyToOne(() => PreliminaryDrugTest, { nullable: true })
  @JoinColumn({ name: 'preliminary_drug_test_id' })
  preliminaryDrugTest: PreliminaryDrugTest | null;

  @ManyToOne(() => DefinitiveDrugTest, { nullable: true })
  @JoinColumn({ name: 'definitive_drug_test_id' })
  definitiveDrugTest: DefinitiveDrugTest | null;
  
  @ManyToOne(() => PatrimonyItem, (item) => item.documents, { nullable: true })
  @JoinColumn({ name: 'patrimony_item_id' })
  patrimonyItem: PatrimonyItem | null;

  // --- FIM DOS RELACIONAMENTOS "PAI" ---

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}