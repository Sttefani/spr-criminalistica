// Arquivo: src/documents/documents.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { PreliminaryDrugTest } from '../preliminary-drug-tests/entities/preliminary-drug-test.entity';
import { User } from '../users/entities/users.entity';
import { DocumentType } from './enums/document-type.enum';
import { MINIO_CLIENT } from '../config/minio-client.config';

// --- Mocks dos Repositórios e Clientes ---
const mockDocumentsRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

const mockPdtRepository = {
  findOneBy: jest.fn(),
};

// Mock do S3Client usando a biblioteca 'aws-sdk-client-mock'
const s3Mock = mockClient(S3Client);

describe('DocumentsService', () => {
  let service: DocumentsService;
  let documentsRepository: Repository<Document>;
  let pdtRepository: Repository<PreliminaryDrugTest>;

  const mockUser = { id: 'user-uuid' } as User;
  const mockFile = {
    originalname: 'laudo.pdf',
    buffer: Buffer.from('test-file'),
    mimetype: 'application/pdf',
    size: 1024,
  };

  beforeEach(async () => {
    // Reseta o mock do S3 antes de cada teste
    s3Mock.reset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentsRepository,
        },
        {
          provide: getRepositoryToken(PreliminaryDrugTest),
          useValue: mockPdtRepository,
        },
        {
          provide: MINIO_CLIENT,
          useValue: new S3Client({}), // Provê uma instância fake que será mockada
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    documentsRepository = module.get<Repository<Document>>(getRepositoryToken(Document));
    pdtRepository = module.get<Repository<PreliminaryDrugTest>>(getRepositoryToken(PreliminaryDrugTest));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'uploadFile' ---
  describe('uploadFile', () => {
    it('should upload a file and create a document record successfully', async () => {
      const caseId = 'case-uuid';
      const caseRecord = { id: caseId, caseNumber: '2025-001' };
      const newDocument = { id: 'doc-uuid', originalName: mockFile.originalname };

      mockPdtRepository.findOneBy.mockResolvedValue(caseRecord);
      s3Mock.on(PutObjectCommand).resolves({}); // Simula o sucesso do upload no S3
      mockDocumentsRepository.create.mockReturnValue(newDocument);
      mockDocumentsRepository.save.mockResolvedValue(newDocument);

      // CORREÇÃO: Alterado para usar o valor correto do enum
      const result = await service.uploadFile(mockFile, caseId, DocumentType.LAUDO_PERICIAL_CRIMINAL, mockUser);

      expect(result).toEqual(newDocument);
      expect(pdtRepository.findOneBy).toHaveBeenCalledWith({ id: caseId });
      expect(s3Mock.calls()).toHaveLength(1); // Verifica se o comando de upload foi enviado
      expect(documentsRepository.save).toHaveBeenCalledWith(newDocument);
    });

    it('should throw BadRequestException if no file is provided', async () => {
      await expect(service.uploadFile(null, 'case-id', DocumentType.LAUDO_PERICIAL_CRIMINAL, mockUser))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if the case record is not found', async () => {
      mockPdtRepository.findOneBy.mockResolvedValue(null);

      await expect(service.uploadFile(mockFile, 'non-existent-case', DocumentType.LAUDO_PERICIAL_CRIMINAL, mockUser))
        .rejects.toThrow(NotFoundException);
    });
  });
});
