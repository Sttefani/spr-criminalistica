// Arquivo: src/forensic-services/forensic-services.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ForensicServicesController } from './forensic-services.controller';
import { ForensicServicesService } from './forensic-services.service';
import { CreateForensicServiceDto } from './dto/create-forensic-service.dto';
import { UpdateForensicServiceDto } from './dto/update-forensic-service.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';

// --- Mock do Serviço ---
const mockForensicServicesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ForensicServicesController', () => {
  let controller: ForensicServicesController;
  let service: ForensicServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForensicServicesController],
      providers: [
        {
          provide: ForensicServicesService,
          useValue: mockForensicServicesService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<ForensicServicesController>(ForensicServicesController);
    service = module.get<ForensicServicesService>(ForensicServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call servicesService.create with the correct data', async () => {
      const createDto: CreateForensicServiceDto = { name: 'Perícia de Informática', acronym: 'PI' };
      const expectedResult = { id: '1', ...createDto };
      mockForensicServicesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  // --- Teste para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call servicesService.findAll', async () => {
      const expectedResult = [{ id: '1', name: 'Perícia de Informática' }];
      mockForensicServicesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'findOne' (GET /:id) ---
  describe('findOne', () => {
    it('should call servicesService.findOne with the correct id', async () => {
      const serviceId = 'service-id';
      const expectedResult = { id: serviceId, name: 'Perícia de Informática' };
      mockForensicServicesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(serviceId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(serviceId);
    });
  });

  // --- Teste para o endpoint 'update' (PATCH /:id) ---
  describe('update', () => {
    it('should call servicesService.update with the correct id and dto', async () => {
      const serviceId = 'service-id';
      const updateDto: UpdateForensicServiceDto = { name: 'Perícia de Computadores' };
      const expectedResult = { id: serviceId, name: 'Perícia de Computadores' };
      mockForensicServicesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(serviceId, updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(serviceId, updateDto);
    });
  });

  // --- Teste para o endpoint 'remove' (DELETE /:id) ---
  describe('remove', () => {
    it('should call servicesService.remove with the correct id', async () => {
      const serviceId = 'service-id';
      mockForensicServicesService.remove.mockResolvedValue(undefined);

      await controller.remove(serviceId);

      expect(service.remove).toHaveBeenCalledWith(serviceId);
    });
  });
});
