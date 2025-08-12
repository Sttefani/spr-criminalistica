// Arquivo: src/forensic-services/forensic-services.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { ForensicServicesService } from './forensic-services.service';
import { ForensicService } from './entities/forensic-service.entity';
import { CreateForensicServiceDto } from './dto/create-forensic-service.dto';
import { UpdateForensicServiceDto } from './dto/update-forensic-service.dto';

// --- Mock do Repositório ---
const mockForensicServicesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softDelete: jest.fn(),
};

describe('ForensicServicesService', () => {
  let service: ForensicServicesService;
  let repository: Repository<ForensicService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForensicServicesService,
        {
          provide: getRepositoryToken(ForensicService),
          useValue: mockForensicServicesRepository,
        },
      ],
    }).compile();

    service = module.get<ForensicServicesService>(ForensicServicesService);
    repository = module.get<Repository<ForensicService>>(getRepositoryToken(ForensicService));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create a forensic service successfully', async () => {
      const createDto: CreateForensicServiceDto = { name: 'Perícia de Informática', acronym: 'PI' };
      const serviceEntity = { id: 'some-uuid', ...createDto };

      mockForensicServicesRepository.create.mockReturnValue(serviceEntity);
      mockForensicServicesRepository.save.mockResolvedValue(serviceEntity);

      const result = await service.create(createDto);

      expect(result).toEqual(serviceEntity);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(serviceEntity);
    });

    it('should throw ConflictException on duplicate service', async () => {
      const createDto: CreateForensicServiceDto = { name: 'Perícia de Informática', acronym: 'PI' };
      mockForensicServicesRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  // --- Testes para o método 'findOne' ---
  describe('findOne', () => {
    it('should return a forensic service if found', async () => {
      const serviceId = 'some-uuid';
      const expectedService = { id: serviceId, name: 'Perícia de Informática', acronym: 'PI' };

      mockForensicServicesRepository.findOneBy.mockResolvedValue(expectedService);

      const result = await service.findOne(serviceId);

      expect(result).toEqual(expectedService);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: serviceId });
    });

    it('should throw NotFoundException if service is not found', async () => {
      mockForensicServicesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'update' ---
  describe('update', () => {
    it('should update a forensic service successfully', async () => {
      const serviceId = 'some-uuid';
      const updateDto: UpdateForensicServiceDto = { name: 'Perícia de Computadores' };
      const existingService = { id: serviceId, name: 'Perícia de Informática', acronym: 'PI' };
      const updatedService = { ...existingService, ...updateDto };

      mockForensicServicesRepository.preload.mockResolvedValue(updatedService);
      mockForensicServicesRepository.save.mockResolvedValue(updatedService);

      const result = await service.update(serviceId, updateDto);

      expect(result).toEqual(updatedService);
      expect(repository.preload).toHaveBeenCalledWith({ id: serviceId, ...updateDto });
      expect(repository.save).toHaveBeenCalledWith(updatedService);
    });
  });

  // --- Testes para o método 'remove' ---
  describe('remove', () => {
    it('should soft delete a forensic service', async () => {
      const serviceId = 'some-uuid';
      const serviceEntity = { id: serviceId, name: 'Serviço a ser removido', acronym: 'SSR' };

      mockForensicServicesRepository.findOneBy.mockResolvedValue(serviceEntity);
      mockForensicServicesRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(serviceId);

      // O remove chama o findOne internamente, então mockamos o findOneBy
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: serviceId });
      expect(repository.softDelete).toHaveBeenCalledWith(serviceId);
    });
  });
});
