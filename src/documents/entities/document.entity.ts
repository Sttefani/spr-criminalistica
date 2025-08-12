// Arquivo: src/documents/entities/document.entity.ts

import { PreliminaryDrugTest } from 'src/preliminary-drug-tests/entities/preliminary-drug-test.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { DocumentType } from '../enums/document-type.enum';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nome original do arquivo, como foi enviado pelo usuário
  @Column()
  originalName: string;

  // Chave/caminho único do arquivo no nosso serviço de armazenamento (MinIO/S3)
  @Column({ unique: true })
  storageKey: string;

  // Tipo MIME do arquivo (ex: 'application/pdf', 'image/jpeg')
  @Column()
  mimeType: string;

  // Tamanho do arquivo em bytes
  @Column({ type: 'int' })
  size: number;

  // Categoria do documento, usando nosso enum
  @Column({ type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  // --- Relacionamentos ---

  // Muitos documentos podem pertencer a um caso (Exame Preliminar)
  @ManyToOne(() => PreliminaryDrugTest)
  @JoinColumn({ name: 'case_id' })
  case: PreliminaryDrugTest;

  // Muitos documentos podem ser enviados pelo mesmo usuário
  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;

  // Relacionamento opcional para erratas: um documento pode ser uma errata de outro
  @OneToOne(() => Document, { nullable: true })
  @JoinColumn({ name: 'parent_document_id' })
  parentDocument?: Document;

  @CreateDateColumn()
  createdAt: Date;
}