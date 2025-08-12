// Arquivo: src/occurrence-classifications/occurrence-classifications.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { OccurrenceClassificationsService } from './occurrence-classifications.service';
import { OccurrenceClassification } from './entities/occurrence-classification.entity';
import { CreateOccurrenceClassificationDto } from './dto/create-occurrence-classification.dto';
import { UpdateOccurrenceClassificationDto } from './dto/update-occurrence-classification.dto';

// --- Mock do Repositório ---
const mockClassificationsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softDelete: jest.fn(),
};

describe('OccurrenceClassificationsService', () => {
  let service: OccurrenceClassificationsService;
  let repository: Repository<OccurrenceClassification>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OccurrenceClassificationsService,
        {
          provide: getRepositoryToken(OccurrenceClassification),
          useValue: mockClassificationsRepository,
        },
      ],
    }).compile();

    service = module.get<OccurrenceClassificationsService>(OccurrenceClassificationsService);
    repository = module.get<Repository<OccurrenceClassification>>(getRepositoryToken(OccurrenceClassification));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create a classification successfully', async () => {
      const createDto: CreateOccurrenceClassificationDto = { code: '101', name: 'Homicídio' };
      const classificationEntity = { id: 'some-uuid', ...createDto };

      mockClassificationsRepository.create.mockReturnValue(classificationEntity);
      mockClassificationsRepository.save.mockResolvedValue(classificationEntity);

      const result = await service.create(createDto);

      expect(result).toEqual(classificationEntity);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(classificationEntity);
    });

    it('should throw ConflictException on duplicate code', async () => {
      const createDto: CreateOccurrenceClassificationDto = { code: '101', name: 'Homicídio' };
      mockClassificationsRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  // --- Testes para o método 'findOne' ---
  describe('findOne', () => {
    it('should return a classification if found', async () => {
      const classificationId = 'some-uuid';
      const expectedClassification = { id: classificationId, code: '101', name: 'Homicídio' };

      mockClassificationsRepository.findOneBy.mockResolvedValue(expectedClassification);

      const result = await service.findOne(classificationId);

      expect(result).toEqual(expectedClassification);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: classificationId });
    });

    it('should throw NotFoundException if classification is not found', async () => {
      mockClassificationsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'update' ---
  describe('update', () => {
    it('should update a classification successfully', async () => {
      const classificationId = 'some-uuid';
      const updateDto: UpdateOccurrenceClassificationDto = { name: 'Homicídio Doloso' };
      const existingClassification = { id: classificationId, code: '101', name: 'Homicídio' };
      const updatedClassification = { ...existingClassification, ...updateDto };

      mockClassificationsRepository.preload.mockResolvedValue(updatedClassification);
      mockClassificationsRepository.save.mockResolvedValue(updatedClassification);

      const result = await service.update(classificationId, updateDto);

      expect(result).toEqual(updatedClassification);
      expect(repository.preload).toHaveBeenCalledWith({ id: classificationId, ...updateDto });
      expect(repository.save).toHaveBeenCalledWith(updatedClassification);
    });
  });

  // --- Testes para o método 'remove' ---
  describe('remove', () => {
    it('should soft delete a classification', async () => {
      const classificationId = 'some-uuid';
      const classification = { id: classificationId, code: '999', name: 'A ser removido' };

      mockClassificationsRepository.findOneBy.mockResolvedValue(classification);
      mockClassificationsRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(classificationId);

      // O remove chama o findOne internamente, então mockamos o findOneBy
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: classificationId });
      expect(repository.softDelete).toHaveBeenCalledWith(classificationId);
    });
  });
});
