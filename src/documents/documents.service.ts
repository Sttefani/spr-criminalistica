import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { MINIO_CLIENT } from 'src/config/minio-client.config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { DocumentType } from './enums/document-type.enum';
import { User } from 'src/users/entities/users.entity';
import { PreliminaryDrugTest } from 'src/preliminary-drug-tests/entities/preliminary-drug-test.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(MINIO_CLIENT) private minioClient: S3Client,
    @InjectRepository(Document) private documentsRepository: Repository<Document>,
    @InjectRepository(PreliminaryDrugTest) private pdtRepository: Repository<PreliminaryDrugTest>,
  ) {}

  async uploadFile(
    file: any, // Tipo alterado para 'any' para evitar o erro de compilação
    caseId: string,
    documentType: DocumentType,
    uploadedBy: User,
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    const caseRecord = await this.pdtRepository.findOneBy({ id: caseId });
    if (!caseRecord) {
      throw new NotFoundException(`Caso com o ID "${caseId}" não encontrado.`);
    }

    const bucketName = 'laudos';
    const fileExtension = file.originalname.split('.').pop();
    const storageKey = `laudos/${caseRecord.caseNumber}/${documentType.toLowerCase()}_${randomUUID()}.${fileExtension}`;

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
      case: caseRecord,
      uploadedBy,
    });

    return this.documentsRepository.save(newDocument);
  }
}