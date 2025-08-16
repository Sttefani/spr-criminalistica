// Arquivo: src/documents/entities/document.entity.ts

import { PreliminaryDrugTest } from 'src/preliminary-drug-tests/entities/preliminary-drug-test.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, OneToOne,
} from 'typeorm';
import { DocumentType } from '../enums/document-type.enum';
import { PatrimonyItem } from 'src/patrimony-items/entities/patrimony-item.entity'; // Importa a entidade PatrimonyItem

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

  @Column()
  relatedEntityId: string; // O ID da entidade à qual este documento pertence (ex: ID da ocorrência)

  @Column()
  relatedEntityType: string; // O nome da entidade (ex: 'GeneralOccurrence', 'PatrimonyItem')
  // --- FIM DO RELACIONAMENTO GENÉRICO ---

  // --- Relacionamentos ---

  @ManyToOne(() => PreliminaryDrugTest, { nullable: true })
  @JoinColumn({ name: 'case_id' })
  case?: PreliminaryDrugTest;

  // --- O RELACIONAMENTO QUE ESTÁ FALTANDO ---
  @ManyToOne(() => PatrimonyItem, (item) => item.documents, { nullable: true })
  @JoinColumn({ name: 'patrimony_item_id' })
  patrimonyItem?: PatrimonyItem;
  // --- FIM DO RELACIONAMENTO ---

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;

  @OneToOne(() => Document, { nullable: true })
  @JoinColumn({ name: 'parent_document_id' })
  parentDocument?: Document;

  @CreateDateColumn()
  createdAt: Date;
}