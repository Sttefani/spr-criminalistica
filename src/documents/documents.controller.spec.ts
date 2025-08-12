// Arquivo: src/documents/documents.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';
import { User } from '../users/entities/users.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentType } from './enums/document-type.enum';

// --- Mock do Serviço ---
const mockDocumentsService = {
  uploadFile: jest.fn(),
};

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockUser = { id: 'user-uuid' } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    })
    // Mockamos os Guards para que eles não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'uploadFile' (POST /upload) ---
  describe('uploadFile', () => {
    it('should call documentsService.uploadFile with the correct parameters', async () => {
      // 1. Preparamos os dados de teste
      const mockFile = {
        originalname: 'laudo.pdf',
        buffer: Buffer.from('test-file-content'),
        mimetype: 'application/pdf',
        size: 1024,
      };
      const createDto: CreateDocumentDto = {
        caseId: 'case-uuid-123',
        documentType: DocumentType.LAUDO_PERICIAL_CRIMINAL,
      };
      const mockRequest = { user: mockUser };
      const expectedResult = { id: 'doc-uuid-456', originalName: 'laudo.pdf' };

      // 2. Configuramos o mock do serviço para retornar o resultado esperado
      mockDocumentsService.uploadFile.mockResolvedValue(expectedResult);

      // 3. Chamamos o método do controller com os dados de teste
      const result = await controller.uploadFile(mockFile, createDto, mockRequest);

      // 4. Verificamos se o resultado está correto e se o serviço foi chamado corretamente
      expect(result).toEqual(expectedResult);
      expect(service.uploadFile).toHaveBeenCalledWith(
        mockFile,
        createDto.caseId,
        createDto.documentType,
        mockUser,
      );
    });
  });
});
