// Arquivo: src/preliminary-drug-tests/preliminary-drug-tests.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PreliminaryDrugTestsController } from './preliminary-drug-tests.controller';
import { PreliminaryDrugTestsService } from './preliminary-drug-tests.service';
import { CreatePreliminaryDrugTestDto } from './dto/create-preliminary-drug-test.dto';
import { UpdatePreliminaryDrugTestDto } from './dto/update-preliminary-drug-test.dto';
import { SendToLabDto } from './dto/send-to-lab.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';
import { User } from '../users/entities/users.entity';
import { UserRole } from '../users/enums/users-role.enum';

// --- Mock do Serviço ---
const mockPdtService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  sendToLab: jest.fn(),
  remove: jest.fn(),
};

describe('PreliminaryDrugTestsController', () => {
  let controller: PreliminaryDrugTestsController;
  let service: PreliminaryDrugTestsService;

  const mockUser = { id: 'user-uuid', role: UserRole.PERITO_OFICIAL } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreliminaryDrugTestsController],
      providers: [
        {
          provide: PreliminaryDrugTestsService,
          useValue: mockPdtService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<PreliminaryDrugTestsController>(PreliminaryDrugTestsController);
    service = module.get<PreliminaryDrugTestsService>(PreliminaryDrugTestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call pdtService.create with the correct data', async () => {
      const createDto: CreatePreliminaryDrugTestDto = { procedureId: 'proc-uuid', cityId: 'city-uuid' } as any;
      const mockRequest = { user: mockUser };
      const expectedResult = { id: '1', ...createDto };
      mockPdtService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser);
    });
  });

  // --- Teste para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call pdtService.findAll', async () => {
      const expectedResult = [{ id: '1', caseNumber: '1-2025' }];
      mockPdtService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'update' (PATCH /:id) ---
  describe('update', () => {
    it('should call pdtService.update with the correct id, dto, and user', async () => {
      const pdtId = 'pdt-id';
      const updateDto: UpdatePreliminaryDrugTestDto = { sealIn: 'new-seal' };
      const mockRequest = { user: mockUser };
      const expectedResult = { id: pdtId, sealIn: 'new-seal' };
      mockPdtService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(pdtId, updateDto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(pdtId, updateDto, mockUser);
    });
  });

  // --- Teste para o endpoint 'sendToLab' (PATCH /:id/send-to-lab) ---
  describe('sendToLab', () => {
    it('should call pdtService.sendToLab with the correct id and dto', async () => {
      const pdtId = 'pdt-id';
      const sendToLabDto: SendToLabDto = { forensicServiceId: 'fs-uuid' };
      const expectedResult = { id: pdtId, caseStatus: 'IN_LAB_ANALYSIS' };
      mockPdtService.sendToLab.mockResolvedValue(expectedResult);

      const result = await controller.sendToLab(pdtId, sendToLabDto);

      expect(result).toEqual(expectedResult);
      expect(service.sendToLab).toHaveBeenCalledWith(pdtId, sendToLabDto);
    });
  });

  // --- Teste para o endpoint 'remove' (DELETE /:id) ---
  describe('remove', () => {
    it('should call pdtService.remove with the correct id', async () => {
      const pdtId = 'pdt-id';
      mockPdtService.remove.mockResolvedValue(undefined);

      await controller.remove(pdtId);

      expect(service.remove).toHaveBeenCalledWith(pdtId);
    });
  });
});
