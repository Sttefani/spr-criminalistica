// Arquivo: src/definitive-drug-tests/definitive-drug-tests.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { DefinitiveDrugTestsController } from './definitive-drug-tests.controller';
import { DefinitiveDrugTestsService } from './definitive-drug-tests.service';
import { CreateDefinitiveDrugTestDto } from './dto/create-definitive-drug-test.dto';
import { UpdateDefinitiveDrugTestDto } from './dto/update-definitive-drug-test.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';
import { User } from '../users/entities/users.entity';
import { UserRole } from '../users/enums/users-role.enum';

// --- Mock do Serviço ---
const mockDefinitiveService = {
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('DefinitiveDrugTestsController', () => {
  let controller: DefinitiveDrugTestsController;
  let service: DefinitiveDrugTestsService;

  const mockUser = { id: 'user-uuid', role: UserRole.PERITO_OFICIAL } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefinitiveDrugTestsController],
      providers: [
        {
          provide: DefinitiveDrugTestsService,
          useValue: mockDefinitiveService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<DefinitiveDrugTestsController>(DefinitiveDrugTestsController);
    service = module.get<DefinitiveDrugTestsService>(DefinitiveDrugTestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call definitiveService.create with the correct data', async () => {
      const createDto: CreateDefinitiveDrugTestDto = { preliminaryTestId: 'prelim-uuid', expertId: 'expert-uuid', analysisResult: 'Positivo', techniqueIds: [] };
      const mockRequest = { user: mockUser };
      const expectedResult = { id: '1', ...createDto };
      mockDefinitiveService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser);
    });
  });

  // --- Teste para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call definitiveService.findAll', async () => {
      const expectedResult = [{ id: '1', analysisResult: 'Positivo' }];
      mockDefinitiveService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'update' (PATCH /:id) ---
  describe('update', () => {
    it('should call definitiveService.update with the correct id, dto, and user', async () => {
      const testId = 'test-id';
      const updateDto: UpdateDefinitiveDrugTestDto = { analysisResult: 'Negativo' };
      const mockRequest = { user: mockUser };
      const expectedResult = { id: testId, analysisResult: 'Negativo' };
      mockDefinitiveService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(testId, updateDto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(testId, updateDto, mockUser);
    });
  });

  // --- Teste para o endpoint 'remove' (DELETE /:id) ---
  describe('remove', () => {
    it('should call definitiveService.remove with the correct id', async () => {
      const testId = 'test-id';
      mockDefinitiveService.remove.mockResolvedValue(undefined);

      await controller.remove(testId);

      expect(service.remove).toHaveBeenCalledWith(testId);
    });
  });
});
