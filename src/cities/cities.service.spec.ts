// Arquivo: src/cities/cities.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

// --- Mock do Repositório ---
const mockCitiesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softDelete: jest.fn(),
};

describe('CitiesService', () => {
  let service: CitiesService;
  let repository: Repository<City>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: getRepositoryToken(City),
          useValue: mockCitiesRepository,
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    repository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create a city successfully', async () => {
      const createDto: CreateCityDto = { name: 'São Paulo', state: 'SP' };
      const cityEntity = { id: 'some-uuid', ...createDto };

      mockCitiesRepository.create.mockReturnValue(cityEntity);
      mockCitiesRepository.save.mockResolvedValue(cityEntity);

      const result = await service.create(createDto);

      expect(result).toEqual(cityEntity);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(cityEntity);
    });

    it('should throw ConflictException on duplicate city', async () => {
      const createDto: CreateCityDto = { name: 'São Paulo', state: 'SP' };
      mockCitiesRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  // --- Testes para o método 'findAll' ---
  describe('findAll', () => {
    it('should return an array of cities', async () => {
      const expectedCities = [{ id: 'uuid-1', name: 'São Paulo', state: 'SP' }];
      mockCitiesRepository.find.mockResolvedValue(expectedCities);

      const result = await service.findAll();

      expect(result).toEqual(expectedCities);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  // --- Testes para o método 'findOne' ---
  describe('findOne', () => {
    it('should return a city if found', async () => {
      const cityId = 'some-uuid';
      const expectedCity = { id: cityId, name: 'São Paulo', state: 'SP' };

      mockCitiesRepository.findOneBy.mockResolvedValue(expectedCity);

      const result = await service.findOne(cityId);

      expect(result).toEqual(expectedCity);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: cityId });
    });

    it('should throw NotFoundException if city is not found', async () => {
      mockCitiesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'update' ---
  describe('update', () => {
    it('should update a city successfully', async () => {
      const cityId = 'some-uuid';
      const updateDto: UpdateCityDto = { name: 'Rio de Janeiro' };
      const existingCity = { id: cityId, name: 'São Paulo', state: 'SP' };
      const updatedCity = { ...existingCity, ...updateDto };

      mockCitiesRepository.preload.mockResolvedValue(updatedCity);
      mockCitiesRepository.save.mockResolvedValue(updatedCity);

      const result = await service.update(cityId, updateDto);

      expect(result).toEqual(updatedCity);
      expect(repository.preload).toHaveBeenCalledWith({ id: cityId, ...updateDto });
      expect(repository.save).toHaveBeenCalledWith(updatedCity);
    });

    it('should throw NotFoundException if city to update is not found', async () => {
      mockCitiesRepository.preload.mockResolvedValue(null);

      await expect(service.update('non-existent-id', { name: 'Novo Nome' })).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'remove' ---
  describe('remove', () => {
    it('should soft delete a city', async () => {
      const cityId = 'some-uuid';
      const city = { id: cityId, name: 'Cidade a ser removida', state: 'SP' };

      mockCitiesRepository.findOneBy.mockResolvedValue(city);
      mockCitiesRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(cityId);

      // O remove chama o findOne internamente, então precisamos mockar o findOneBy
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: cityId });
      expect(repository.softDelete).toHaveBeenCalledWith(cityId);
    });

    it('should throw NotFoundException if city to remove is not found', async () => {
      mockCitiesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
