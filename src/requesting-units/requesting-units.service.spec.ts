// Arquivo: src/requesting-units/requesting-units.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { RequestingUnitsService } from './requesting-units.service';
import { RequestingUnit } from './entities/requesting-unit.entity';
import { CreateRequestingUnitDto } from './dto/create-requesting-unit.dto';
import { UpdateRequestingUnitDto } from './dto/update-requesting-unit.dto';

// --- Mock do Repositório ---
const mockRequestingUnitsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softDelete: jest.fn(),
};

describe('RequestingUnitsService', () => {
  let service: RequestingUnitsService;
  let repository: Repository<RequestingUnit>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestingUnitsService,
        {
          provide: getRepositoryToken(RequestingUnit),
          useValue: mockRequestingUnitsRepository,
        },
      ],
    }).compile();

    service = module.get<RequestingUnitsService>(RequestingUnitsService);
    repository = module.get<Repository<RequestingUnit>>(getRepositoryToken(RequestingUnit));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create a requesting unit successfully', async () => {
      const createDto: CreateRequestingUnitDto = { name: 'Delegacia Central', acronym: 'DC' };
      const unitEntity = { id: 'some-uuid', ...createDto };

      mockRequestingUnitsRepository.create.mockReturnValue(unitEntity);
      mockRequestingUnitsRepository.save.mockResolvedValue(unitEntity);

      const result = await service.create(createDto);

      expect(result).toEqual(unitEntity);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(unitEntity);
    });

    it('should throw ConflictException on duplicate unit', async () => {
      const createDto: CreateRequestingUnitDto = { name: 'Delegacia Central', acronym: 'DC' };
      mockRequestingUnitsRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  // --- Testes para o método 'findOne' ---
  describe('findOne', () => {
    it('should return a requesting unit if found', async () => {
      const unitId = 'some-uuid';
      const expectedUnit = { id: unitId, name: 'Delegacia Central', acronym: 'DC' };

      mockRequestingUnitsRepository.findOneBy.mockResolvedValue(expectedUnit);

      const result = await service.findOne(unitId);

      expect(result).toEqual(expectedUnit);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: unitId });
    });

    it('should throw NotFoundException if unit is not found', async () => {
      mockRequestingUnitsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'update' ---
  describe('update', () => {
    it('should update a requesting unit successfully', async () => {
      const unitId = 'some-uuid';
      const updateDto: UpdateRequestingUnitDto = { name: 'Delegacia Regional' };
      const existingUnit = { id: unitId, name: 'Delegacia Central', acronym: 'DC' };
      const updatedUnit = { ...existingUnit, ...updateDto };

      mockRequestingUnitsRepository.preload.mockResolvedValue(updatedUnit);
      mockRequestingUnitsRepository.save.mockResolvedValue(updatedUnit);

      const result = await service.update(unitId, updateDto);

      expect(result).toEqual(updatedUnit);
      expect(repository.preload).toHaveBeenCalledWith({ id: unitId, ...updateDto });
      expect(repository.save).toHaveBeenCalledWith(updatedUnit);
    });
  });

  // --- Testes para o método 'remove' ---
  describe('remove', () => {
    it('should soft delete a requesting unit', async () => {
      const unitId = 'some-uuid';
      const unit = { id: unitId, name: 'Unidade a ser removida', acronym: 'USR' };

      mockRequestingUnitsRepository.findOneBy.mockResolvedValue(unit);
      mockRequestingUnitsRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(unitId);

      // O remove chama o findOne internamente, então mockamos o findOneBy
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: unitId });
      expect(repository.softDelete).toHaveBeenCalledWith(unitId);
    });
  });
});
