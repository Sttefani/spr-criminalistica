// Arquivo: src/requesting-units/requesting-units.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { RequestingUnitsController } from './requesting-units.controller';
import { RequestingUnitsService } from './requesting-units.service';
import { CreateRequestingUnitDto } from './dto/create-requesting-unit.dto';
import { UpdateRequestingUnitDto } from './dto/update-requesting-unit.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';

// --- Mock do Serviço ---
const mockRequestingUnitsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('RequestingUnitsController', () => {
  let controller: RequestingUnitsController;
  let service: RequestingUnitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestingUnitsController],
      providers: [
        {
          provide: RequestingUnitsService,
          useValue: mockRequestingUnitsService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<RequestingUnitsController>(RequestingUnitsController);
    service = module.get<RequestingUnitsService>(RequestingUnitsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call requestingUnitsService.create with the correct data', async () => {
      const createDto: CreateRequestingUnitDto = { name: 'Delegacia Central', acronym: 'DC' };
      const expectedResult = { id: '1', ...createDto };
      mockRequestingUnitsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  // --- Teste para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call requestingUnitsService.findAll', async () => {
      const expectedResult = [{ id: '1', name: 'Delegacia Central' }];
      mockRequestingUnitsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'findOne' (GET /:id) ---
  describe('findOne', () => {
    it('should call requestingUnitsService.findOne with the correct id', async () => {
      const unitId = 'unit-id';
      const expectedResult = { id: unitId, name: 'Delegacia Central' };
      mockRequestingUnitsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(unitId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(unitId);
    });
  });

  // --- Teste para o endpoint 'update' (PATCH /:id) ---
  describe('update', () => {
    it('should call requestingUnitsService.update with the correct id and dto', async () => {
      const unitId = 'unit-id';
      const updateDto: UpdateRequestingUnitDto = { name: 'Delegacia Regional' };
      const expectedResult = { id: unitId, name: 'Delegacia Regional' };
      mockRequestingUnitsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(unitId, updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(unitId, updateDto);
    });
  });

  // --- Teste para o endpoint 'remove' (DELETE /:id) ---
  describe('remove', () => {
    it('should call requestingUnitsService.remove with the correct id', async () => {
      const unitId = 'unit-id';
      mockRequestingUnitsService.remove.mockResolvedValue(undefined);

      await controller.remove(unitId);

      expect(service.remove).toHaveBeenCalledWith(unitId);
    });
  });
});
