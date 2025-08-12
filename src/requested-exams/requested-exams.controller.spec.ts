// Arquivo: src/requested-exams/requested-exams.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { RequestedExamsController } from './requested-exams.controller';
import { RequestedExamsService } from './requested-exams.service';
import { CreateRequestedExamDto } from './dto/create-requested-exam.dto';
import { UpdateRequestedExamDto } from './dto/update-requested-exam.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';
import { User } from '../users/entities/users.entity';
import { UserRole } from '../users/enums/users-role.enum';

// --- Mock do Serviço ---
const mockRequestedExamsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findAllByOccurrence: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('RequestedExamsController', () => {
  let controller: RequestedExamsController;
  let service: RequestedExamsService;

  const mockUser = { id: 'user-uuid', role: UserRole.PERITO_OFICIAL } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestedExamsController],
      providers: [
        {
          provide: RequestedExamsService,
          useValue: mockRequestedExamsService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<RequestedExamsController>(RequestedExamsController);
    service = module.get<RequestedExamsService>(RequestedExamsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call requestedExamsService.create with the correct data', async () => {
      const createDto: CreateRequestedExamDto = { occurrenceId: 'occ-uuid', examTypeId: 'exam-uuid' };
      const mockRequest = { user: mockUser };
      const expectedResult = { id: '1', ...createDto };
      mockRequestedExamsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser);
    });
  });

  // --- Testes para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call findAll when no occurrenceId is provided', async () => {
      const expectedResult = [{ id: '1' }];
      mockRequestedExamsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAllByOccurrence).not.toHaveBeenCalled();
    });

    it('should call findAllByOccurrence when an occurrenceId is provided', async () => {
      const occurrenceId = 'occ-uuid';
      const expectedResult = [{ id: '1', occurrence: { id: occurrenceId } }];
      mockRequestedExamsService.findAllByOccurrence.mockResolvedValue(expectedResult);

      const result = await controller.findAll(occurrenceId);

      expect(result).toEqual(expectedResult);
      expect(service.findAllByOccurrence).toHaveBeenCalledWith(occurrenceId);
      expect(service.findAll).not.toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'update' (PATCH /:id) ---
  describe('update', () => {
    it('should call requestedExamsService.update with the correct id, dto, and user', async () => {
      const examId = 'exam-id';
      const updateDto: UpdateRequestedExamDto = { status: 'CONCLUIDO' } as any;
      const mockRequest = { user: mockUser };
      const expectedResult = { id: examId, status: 'CONCLUIDO' };
      mockRequestedExamsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(examId, updateDto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(examId, updateDto, mockUser);
    });
  });

  // --- Teste para o endpoint 'remove' (DELETE /:id) ---
  describe('remove', () => {
    it('should call requestedExamsService.remove with the correct id and user', async () => {
      const examId = 'exam-id';
      const mockRequest = { user: mockUser };
      mockRequestedExamsService.remove.mockResolvedValue(undefined);

      await controller.remove(examId, mockRequest);

      expect(service.remove).toHaveBeenCalledWith(examId, mockUser);
    });
  });
});
