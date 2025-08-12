// Arquivo: src/procedures/procedures.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ProceduresController } from './procedures.controller';
import { ProceduresService } from './procedures.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';

// --- Mock do Serviço ---
const mockProceduresService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProceduresController', () => {
  let controller: ProceduresController;
  let service: ProceduresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProceduresController],
      providers: [
        {
          provide: ProceduresService,
          useValue: mockProceduresService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<ProceduresController>(ProceduresController);
    service = module.get<ProceduresService>(ProceduresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call proceduresService.create with the correct data', async () => {
      const createDto: CreateProcedureDto = { name: 'Inquérito Policial', acronym: 'IP' };
      const expectedResult = { id: '1', ...createDto };
      mockProceduresService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  // --- Teste para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call proceduresService.findAll', async () => {
      const expectedResult = [{ id: '1', name: 'Inquérito Policial' }];
      mockProceduresService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'findOne' (GET /:id) ---
  describe('findOne', () => {
    it('should call proceduresService.findOne with the correct id', async () => {
      const procedureId = 'procedure-id';
      const expectedResult = { id: procedureId, name: 'Inquérito Policial' };
      mockProceduresService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(procedureId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(procedureId);
    });
  });

  // --- Teste para o endpoint 'update' (PATCH /:id) ---
  describe('update', () => {
    it('should call proceduresService.update with the correct id and dto', async () => {
      const procedureId = 'procedure-id';
      const updateDto: UpdateProcedureDto = { name: 'Termo Circunstanciado' };
      const expectedResult = { id: procedureId, name: 'Termo Circunstanciado' };
      mockProceduresService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(procedureId, updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(procedureId, updateDto);
    });
  });

  // --- Teste para o endpoint 'remove' (DELETE /:id) ---
  describe('remove', () => {
    it('should call proceduresService.remove with the correct id', async () => {
      const procedureId = 'procedure-id';
      mockProceduresService.remove.mockResolvedValue(undefined);

      await controller.remove(procedureId);

      expect(service.remove).toHaveBeenCalledWith(procedureId);
    });
  });
});
