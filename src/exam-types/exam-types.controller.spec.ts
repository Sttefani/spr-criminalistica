// Arquivo: src/exam-types/exam-types.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ExamTypesController } from './exam-types.controller';
import { ExamTypesService } from './exam-types.service';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';

// --- Mock do Serviço ---
const mockExamTypesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ExamTypesController', () => {
  let controller: ExamTypesController;
  let service: ExamTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamTypesController],
      providers: [
        {
          provide: ExamTypesService,
          useValue: mockExamTypesService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<ExamTypesController>(ExamTypesController);
    service = module.get<ExamTypesService>(ExamTypesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call examTypesService.create with the correct data', async () => {
      const createDto: CreateExamTypeDto = { name: 'Cromatografia Gasosa', acronym: 'GC-MS' };
      const expectedResult = { id: '1', ...createDto };
      mockExamTypesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  // --- Teste para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call examTypesService.findAll', async () => {
      const expectedResult = [{ id: '1', name: 'Cromatografia Gasosa' }];
      mockExamTypesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'findOne' (GET /:id) ---
  describe('findOne', () => {
    it('should call examTypesService.findOne with the correct id', async () => {
      const examTypeId = 'exam-type-id';
      const expectedResult = { id: examTypeId, name: 'Cromatografia Gasosa' };
      mockExamTypesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(examTypeId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(examTypeId);
    });
  });

  // --- Teste para o endpoint 'update' (PATCH /:id) ---
  describe('update', () => {
    it('should call examTypesService.update with the correct id and dto', async () => {
      const examTypeId = 'exam-type-id';
      const updateDto: UpdateExamTypeDto = { name: 'Cromatografia Líquida' };
      const expectedResult = { id: examTypeId, name: 'Cromatografia Líquida' };
      mockExamTypesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(examTypeId, updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(examTypeId, updateDto);
    });
  });

  // --- Teste para o endpoint 'remove' (DELETE /:id) ---
  describe('remove', () => {
    it('should call examTypesService.remove with the correct id', async () => {
      const examTypeId = 'exam-type-id';
      mockExamTypesService.remove.mockResolvedValue(undefined);

      await controller.remove(examTypeId);

      expect(service.remove).toHaveBeenCalledWith(examTypeId);
    });
  });
});
