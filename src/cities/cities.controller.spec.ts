// Arquivo: src/cities/cities.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';

// --- Mock do Serviço ---
const mockCitiesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CitiesController', () => {
  let controller: CitiesController;
  let service: CitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        {
          provide: CitiesService,
          useValue: mockCitiesService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<CitiesController>(CitiesController);
    service = module.get<CitiesService>(CitiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call citiesService.create with the correct data', async () => {
      const createDto: CreateCityDto = { name: 'São Paulo', state: 'SP' };
      const expectedResult = { id: '1', ...createDto };
      mockCitiesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  // --- Teste para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call citiesService.findAll', async () => {
      const expectedResult = [{ id: '1', name: 'São Paulo', state: 'SP' }];
      mockCitiesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'findOne' (GET /:id) ---
  describe('findOne', () => {
    it('should call citiesService.findOne with the correct id', async () => {
      const cityId = 'city-id';
      const expectedResult = { id: cityId, name: 'São Paulo', state: 'SP' };
      mockCitiesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(cityId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(cityId);
    });
  });

  // --- Teste para o endpoint 'update' (PATCH /:id) ---
  describe('update', () => {
    it('should call citiesService.update with the correct id and dto', async () => {
      const cityId = 'city-id';
      const updateDto: UpdateCityDto = { name: 'Rio de Janeiro' };
      const expectedResult = { id: cityId, name: 'Rio de Janeiro', state: 'RJ' };
      mockCitiesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(cityId, updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(cityId, updateDto);
    });
  });

  // --- Teste para o endpoint 'remove' (DELETE /:id) ---
  describe('remove', () => {
    it('should call citiesService.remove with the correct id', async () => {
      const cityId = 'city-id';
      mockCitiesService.remove.mockResolvedValue(undefined);

      await controller.remove(cityId);

      expect(service.remove).toHaveBeenCalledWith(cityId);
    });
  });
});
