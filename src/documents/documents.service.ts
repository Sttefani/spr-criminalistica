// Arquivo: src/documents/documents.service.ts

import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { MINIO_CLIENT } from 'src/config/minio-client.config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { DocumentType } from './enums/document-type.enum';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(MINIO_CLIENT) private minioClient: S3Client,
    @InjectRepository(Document) private documentsRepository: Repository<Document>,
    // O repositório do PreliminaryDrugTest não é mais necessário aqui
  ) {}

  /**
   * Faz o upload de um arquivo para uma entidade genérica.
   */
  async uploadFile(
    file: any,
    relatedEntityId: string,
    relatedEntityType: string,
    documentType: DocumentType,
    uploadedBy: User,
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    const bucketName = 'spr-pericia';
    const fileExtension = file.originalname.split('.').pop();
    // O caminho no S3/MinIO agora é mais genérico
    const storageKey = `${relatedEntityType}/${relatedEntityId}/${documentType.toLowerCase()}_${randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: storageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    
    await this.minioClient.send(command);

    const newDocument = this.documentsRepository.create({
      originalName: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      size: file.size,
      documentType,
      relatedEntityId, // Salva o ID da entidade pai
      relatedEntityType, // Salva o nome da entidade pai
      uploadedBy,
    });

    return this.documentsRepository.save(newDocument);
  }

  /**
   * Lista todos os documentos de uma entidade específica.
   */
  async findAllByRelatedEntity(entityId: string): Promise<Document[]> {
    return this.documentsRepository.findBy({ relatedEntityId: entityId });
  }
}