// Arquivo: src/exam-types/exam-types.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { ExamTypesService } from './exam-types.service';
import { ExamType } from './entities/exam-type.entity';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';

// --- Mock do Repositório ---
const mockExamTypesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softDelete: jest.fn(),
};

describe('ExamTypesService', () => {
  let service: ExamTypesService;
  let repository: Repository<ExamType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamTypesService,
        {
          provide: getRepositoryToken(ExamType),
          useValue: mockExamTypesRepository,
        },
      ],
    }).compile();

    service = module.get<ExamTypesService>(ExamTypesService);
    repository = module.get<Repository<ExamType>>(getRepositoryToken(ExamType));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create an exam type successfully', async () => {
      const createDto: CreateExamTypeDto = { name: 'Cromatografia Gasosa', acronym: 'GC-MS' };
      const examTypeEntity = { id: 'some-uuid', ...createDto };

      mockExamTypesRepository.create.mockReturnValue(examTypeEntity);
      mockExamTypesRepository.save.mockResolvedValue(examTypeEntity);

      const result = await service.create(createDto);

      expect(result).toEqual(examTypeEntity);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(examTypeEntity);
    });

    it('should throw ConflictException on duplicate exam type', async () => {
      const createDto: CreateExamTypeDto = { name: 'Cromatografia Gasosa', acronym: 'GC-MS' };
      mockExamTypesRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  // --- Testes para o método 'findOne' ---
  describe('findOne', () => {
    it('should return an exam type if found', async () => {
      const examTypeId = 'some-uuid';
      const expectedExamType = { id: examTypeId, name: 'Cromatografia Gasosa', acronym: 'GC-MS' };

      mockExamTypesRepository.findOneBy.mockResolvedValue(expectedExamType);

      const result = await service.findOne(examTypeId);

      expect(result).toEqual(expectedExamType);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: examTypeId });
    });

    it('should throw NotFoundException if exam type is not found', async () => {
      mockExamTypesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'update' ---
  describe('update', () => {
    it('should update an exam type successfully', async () => {
      const examTypeId = 'some-uuid';
      const updateDto: UpdateExamTypeDto = { name: 'Cromatografia Líquida' };
      const existingExamType = { id: examTypeId, name: 'Cromatografia Gasosa', acronym: 'GC-MS' };
      const updatedExamType = { ...existingExamType, ...updateDto };

      mockExamTypesRepository.preload.mockResolvedValue(updatedExamType);
      mockExamTypesRepository.save.mockResolvedValue(updatedExamType);

      const result = await service.update(examTypeId, updateDto);

      expect(result).toEqual(updatedExamType);
      expect(repository.preload).toHaveBeenCalledWith({ id: examTypeId, ...updateDto });
      expect(repository.save).toHaveBeenCalledWith(updatedExamType);
    });

    it('should throw NotFoundException if exam type to update is not found', async () => {
      mockExamTypesRepository.preload.mockResolvedValue(null);

      await expect(service.update('non-existent-id', { name: 'Novo Nome' })).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'remove' ---
  describe('remove', () => {
    it('should soft delete an exam type', async () => {
      const examTypeId = 'some-uuid';
      const examType = { id: examTypeId, name: 'Tipo a ser removido', acronym: 'TSR' };

      mockExamTypesRepository.findOneBy.mockResolvedValue(examType);
      mockExamTypesRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(examTypeId);

      // O remove chama o findOne internamente, então mockamos o findOneBy
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: examTypeId });
      expect(repository.softDelete).toHaveBeenCalledWith(examTypeId);
    });
  });
});
