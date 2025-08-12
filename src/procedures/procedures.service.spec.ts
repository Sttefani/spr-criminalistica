// Arquivo: src/procedures/procedures.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { ProceduresService } from './procedures.service';
import { Procedure } from './entities/procedure.entity';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';

// --- Mock do Repositório ---
const mockProceduresRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softDelete: jest.fn(),
};

describe('ProceduresService', () => {
  let service: ProceduresService;
  let repository: Repository<Procedure>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProceduresService,
        {
          provide: getRepositoryToken(Procedure),
          useValue: mockProceduresRepository,
        },
      ],
    }).compile();

    service = module.get<ProceduresService>(ProceduresService);
    repository = module.get<Repository<Procedure>>(getRepositoryToken(Procedure));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create a procedure successfully', async () => {
      const createDto: CreateProcedureDto = { name: 'Inquérito Policial', acronym: 'IP' };
      const procedureEntity = { id: 'some-uuid', ...createDto };

      mockProceduresRepository.create.mockReturnValue(procedureEntity);
      mockProceduresRepository.save.mockResolvedValue(procedureEntity);

      const result = await service.create(createDto);

      expect(result).toEqual(procedureEntity);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(procedureEntity);
    });

    it('should throw ConflictException on duplicate procedure', async () => {
      const createDto: CreateProcedureDto = { name: 'Inquérito Policial', acronym: 'IP' };
      mockProceduresRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  // --- Testes para o método 'findOne' ---
  describe('findOne', () => {
    it('should return a procedure if found', async () => {
      const procedureId = 'some-uuid';
      const expectedProcedure = { id: procedureId, name: 'Inquérito Policial', acronym: 'IP' };

      mockProceduresRepository.findOneBy.mockResolvedValue(expectedProcedure);

      const result = await service.findOne(procedureId);

      expect(result).toEqual(expectedProcedure);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: procedureId });
    });

    it('should throw NotFoundException if procedure is not found', async () => {
      mockProceduresRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'update' ---
  describe('update', () => {
    it('should update a procedure successfully', async () => {
      const procedureId = 'some-uuid';
      const updateDto: UpdateProcedureDto = { name: 'Termo Circunstanciado de Ocorrência' };
      const existingProcedure = { id: procedureId, name: 'Inquérito Policial', acronym: 'IP' };
      const updatedProcedure = { ...existingProcedure, ...updateDto };

      mockProceduresRepository.preload.mockResolvedValue(updatedProcedure);
      mockProceduresRepository.save.mockResolvedValue(updatedProcedure);

      const result = await service.update(procedureId, updateDto);

      expect(result).toEqual(updatedProcedure);
      expect(repository.preload).toHaveBeenCalledWith({ id: procedureId, ...updateDto });
      expect(repository.save).toHaveBeenCalledWith(updatedProcedure);
    });
  });

  // --- Testes para o método 'remove' ---
  describe('remove', () => {
    it('should soft delete a procedure', async () => {
      const procedureId = 'some-uuid';
      const procedure = { id: procedureId, name: 'Procedimento a ser removido', acronym: 'PSR' };

      mockProceduresRepository.findOneBy.mockResolvedValue(procedure);
      mockProceduresRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(procedureId);

      // O remove chama o findOne internamente, então mockamos o findOneBy
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: procedureId });
      expect(repository.softDelete).toHaveBeenCalledWith(procedureId);
    });
  });
});
