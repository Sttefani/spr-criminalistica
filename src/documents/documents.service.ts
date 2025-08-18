// Arquivo: src/documents/documents.service.ts

import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { MINIO_CLIENT } from 'src/config/minio-client.config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { DocumentType } from './enums/document-type.enum';
import { User } from 'src/users/entities/users.entity';

// Importa TODAS as entidades "pai" possíveis
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { PreliminaryDrugTest } from 'src/preliminary-drug-tests/entities/preliminary-drug-test.entity';
import { DefinitiveDrugTest } from 'src/definitive-drug-tests/entities/definitive-drug-test.entity';
import { PatrimonyItem } from 'src/patrimony-items/entities/patrimony-item.entity';

// Define um tipo para os nomes das entidades "pai"
type ParentEntityType = 'GeneralOccurrence' | 'PreliminaryDrugTest' | 'DefinitiveDrugTest' | 'PatrimonyItem';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(MINIO_CLIENT) private minioClient: S3Client,
    @InjectRepository(Document) private documentsRepository: Repository<Document>,
    // Injeta todos os repositórios "pai"
    @InjectRepository(GeneralOccurrence) private occurrencesRepository: Repository<GeneralOccurrence>,
    @InjectRepository(PreliminaryDrugTest) private pdtRepository: Repository<PreliminaryDrugTest>,
    @InjectRepository(DefinitiveDrugTest) private ddtRepository: Repository<DefinitiveDrugTest>,
    @InjectRepository(PatrimonyItem) private patrimonyRepository: Repository<PatrimonyItem>,
  ) {}

  async uploadFile(
    file: any,
    parentId: string,
    parentType: ParentEntityType,
    documentType: DocumentType,
    uploadedBy: User,
  ): Promise<Document> {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado.');

    // 1. Valida e busca a entidade pai
    let parentEntity: any;
    switch (parentType) {
      case 'GeneralOccurrence':
        parentEntity = await this.occurrencesRepository.findOneBy({ id: parentId });
        break;
      case 'PreliminaryDrugTest':
        parentEntity = await this.pdtRepository.findOneBy({ id: parentId });
        break;
      case 'DefinitiveDrugTest':
        parentEntity = await this.ddtRepository.findOneBy({ id: parentId });
        break;
      case 'PatrimonyItem':
        parentEntity = await this.patrimonyRepository.findOneBy({ id: parentId });
        break;
      default:
        throw new BadRequestException('Tipo de entidade pai inválido.');
    }
    if (!parentEntity) throw new NotFoundException(`Entidade pai do tipo "${parentType}" com ID "${parentId}" não encontrada.`);

    // 2. Upload para o MinIO
    const bucketName = 'spr-pericia';
    const fileExtension = file.originalname.split('.').pop();
    const storageKey = `${parentType}/${parentId}/${documentType.toString().toLowerCase()}_${randomUUID()}.${fileExtension}`;
    const command = new PutObjectCommand({ Bucket: bucketName, Key: storageKey, Body: file.buffer, ContentType: file.mimetype });
    await this.minioClient.send(command);

    // 3. Cria o documento e associa o relacionamento correto
    const newDocument = new Document();
    newDocument.originalName = file.originalname;
    newDocument.storageKey = storageKey;
    newDocument.mimeType = file.mimetype;
    newDocument.size = file.size;
    newDocument.documentType = documentType;
    newDocument.uploadedBy = uploadedBy;

    // Associa a entidade pai correta
    if (parentType === 'GeneralOccurrence') newDocument.generalOccurrence = parentEntity;
    if (parentType === 'PreliminaryDrugTest') newDocument.preliminaryDrugTest = parentEntity;
    if (parentType === 'DefinitiveDrugTest') newDocument.definitiveDrugTest = parentEntity;
    if (parentType === 'PatrimonyItem') newDocument.patrimonyItem = parentEntity;

    return this.documentsRepository.save(newDocument);
  }

  async findAllByParent(parentId: string): Promise<Document[]> {
    return this.documentsRepository.find({
        where: [
            { generalOccurrence: { id: parentId } },
            { preliminaryDrugTest: { id: parentId } },
            { definitiveDrugTest: { id: parentId } },
            { patrimonyItem: { id: parentId } },
        ]
    });
  }
}