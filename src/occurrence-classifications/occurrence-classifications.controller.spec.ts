// Arquivo: src/occurrence-classifications/occurrence-classifications.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { OccurrenceClassificationsController } from './occurrence-classifications.controller';
import { OccurrenceClassificationsService } from './occurrence-classifications.service';
import { CreateOccurrenceClassificationDto } from './dto/create-occurrence-classification.dto';
import { UpdateOccurrenceClassificationDto } from './dto/update-occurrence-classification.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';

// --- Mock do Serviço ---
const mockClassificationsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('OccurrenceClassificationsController', () => {
  let controller: OccurrenceClassificationsController;
  let service: OccurrenceClassificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccurrenceClassificationsController],
      providers: [
        {
          provide: OccurrenceClassificationsService,
          useValue: mockClassificationsService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<OccurrenceClassificationsController>(OccurrenceClassificationsController);
    service = module.get<OccurrenceClassificationsService>(OccurrenceClassificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call classificationsService.create with the correct data', async () => {
      const createDto: CreateOccurrenceClassificationDto = { code: '101', name: 'Homicídio' };
      const expectedResult = { id: '1', ...createDto };
      mockClassificationsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  // --- Teste para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call classificationsService.findAll', async () => {
      const expectedResult = [{ id: '1', name: 'Homicídio' }];
      mockClassificationsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'findOne' (GET /:id) ---
  describe('findOne', () => {
    it('should call classificationsService.findOne with the correct id', async () => {
      const classificationId = 'classification-id';
      const expectedResult = { id: classificationId, name: 'Homicídio' };
      mockClassificationsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(classificationId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(classificationId);
    });
  });

  // --- Teste para o endpoint 'update' (PATCH /:id) ---
  describe('update', () => {
    it('should call classificationsService.update with the correct id and dto', async () => {
      const classificationId = 'classification-id';
      const updateDto: UpdateOccurrenceClassificationDto = { name: 'Homicídio Doloso' };
      const expectedResult = { id: classificationId, name: 'Homicídio Doloso' };
      mockClassificationsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(classificationId, updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(classificationId, updateDto);
    });
  });

  // --- Teste para o endpoint 'remove' (DELETE /:id) ---
  describe('remove', () => {
    it('should call classificationsService.remove with the correct id', async () => {
      const classificationId = 'classification-id';
      mockClassificationsService.remove.mockResolvedValue(undefined);

      await controller.remove(classificationId);

      expect(service.remove).toHaveBeenCalledWith(classificationId);
    });
  });
});
