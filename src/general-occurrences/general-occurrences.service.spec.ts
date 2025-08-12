// Arquivo: src/general-occurrences/general-occurrences.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

import { GeneralOccurrencesService } from './general-occurrences.service';
import { GeneralOccurrence } from './entities/general-occurrence.entity';
import { User } from '../users/entities/users.entity';
import { Procedure } from '../procedures/entities/procedure.entity';
import { ForensicService } from '../forensic-services/entities/forensic-service.entity';
import { RequestingUnit } from '../requesting-units/entities/requesting-unit.entity';
import { Authority } from '../authorities/entities/authority.entity';
import { City } from '../cities/entities/city.entity';
import { CreateGeneralOccurrenceDto } from './dto/create-general-occurrence.dto';
import { UserRole } from '../users/enums/users-role.enum';

// --- Mocks dos Repositórios ---
const mockOccurrencesRepository = { create: jest.fn(), save: jest.fn(), count: jest.fn(), findOne: jest.fn(), softDelete: jest.fn(), createQueryBuilder: jest.fn() };
const mockProcedureRepository = { findOneBy: jest.fn() };
const mockForensicServiceRepository = { findOneBy: jest.fn() };
const mockUserRepository = { findOneBy: jest.fn() };
const mockUnitRepository = { findOneBy: jest.fn() };
const mockAuthorityRepository = { findOneBy: jest.fn() };
const mockCityRepository = { findOneBy: jest.fn() };

describe('GeneralOccurrencesService', () => {
  let service: GeneralOccurrencesService;
  let occurrencesRepository: Repository<GeneralOccurrence>;

  const mockUser = { id: 'user-uuid', role: UserRole.PERITO_OFICIAL } as User;
  const mockAdmin = { id: 'admin-uuid', role: UserRole.SUPER_ADMIN } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneralOccurrencesService,
        { provide: getRepositoryToken(GeneralOccurrence), useValue: mockOccurrencesRepository },
        { provide: getRepositoryToken(Procedure), useValue: mockProcedureRepository },
        { provide: getRepositoryToken(ForensicService), useValue: mockForensicServiceRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(RequestingUnit), useValue: mockUnitRepository },
        { provide: getRepositoryToken(Authority), useValue: mockAuthorityRepository },
        { provide: getRepositoryToken(City), useValue: mockCityRepository },
      ],
    }).compile();

    service = module.get<GeneralOccurrencesService>(GeneralOccurrencesService);
    occurrencesRepository = module.get<Repository<GeneralOccurrence>>(getRepositoryToken(GeneralOccurrence));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create an occurrence successfully', async () => {
      const createDto: CreateGeneralOccurrenceDto = {
        forensicServiceId: 'fs-uuid',
        cityId: 'city-uuid',
        occurrenceDate: new Date(),
        history: 'Test history',
      };
      const newOccurrence = { ...createDto, id: 'occurrence-uuid', caseNumber: '1-2025' };

      // Mock all successful lookups
      mockForensicServiceRepository.findOneBy.mockResolvedValue({ id: 'fs-uuid' });
      mockCityRepository.findOneBy.mockResolvedValue({ id: 'city-uuid' });
      mockOccurrencesRepository.count.mockResolvedValue(0);
      mockOccurrencesRepository.create.mockReturnValue(newOccurrence as any);
      mockOccurrencesRepository.save.mockResolvedValue(newOccurrence as any);

      const result = await service.create(createDto, mockUser);

      expect(result).toEqual(newOccurrence);
      expect(occurrencesRepository.save).toHaveBeenCalledWith(newOccurrence);
    });

    it('should throw NotFoundException if a dependency is not found', async () => {
      mockForensicServiceRepository.findOneBy.mockResolvedValue(null); // Simulate not finding the service
      const createDto: CreateGeneralOccurrenceDto = { forensicServiceId: 'non-existent', cityId: 'city-uuid', occurrenceDate: new Date(), history: 'Test' };

      await expect(service.create(createDto, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'findOne' ---
  describe('findOne', () => {
    it('should return an occurrence if user is the owner', async () => {
      const occurrenceId = 'occurrence-uuid';
      const occurrence = { id: occurrenceId, createdBy: mockUser, responsibleExpert: null };

      mockOccurrencesRepository.findOne.mockResolvedValue(occurrence);

      const result = await service.findOne(occurrenceId, mockUser);

      expect(result).toEqual(occurrence);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const occurrenceId = 'occurrence-uuid';
      const anotherUser = { id: 'another-user-uuid' } as User;
      const occurrence = { id: occurrenceId, createdBy: anotherUser, responsibleExpert: anotherUser };

      mockOccurrencesRepository.findOne.mockResolvedValue(occurrence);

      await expect(service.findOne(occurrenceId, mockUser)).rejects.toThrow(ForbiddenException);
    });
  });

  // --- Testes para o método 'remove' ---
  describe('remove', () => {
    it('should allow an admin to remove an occurrence', async () => {
      const occurrenceId = 'occurrence-uuid';
      const occurrence = { id: occurrenceId, createdBy: mockUser };

      // Mock the findOne call inside remove
      mockOccurrencesRepository.findOne.mockResolvedValue(occurrence);
      mockOccurrencesRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(occurrenceId, mockAdmin);

      expect(occurrencesRepository.softDelete).toHaveBeenCalledWith(occurrenceId);
    });

    it('should throw ForbiddenException if a non-admin tries to remove', async () => {
      const occurrenceId = 'occurrence-uuid';
      const occurrence = { id: occurrenceId, createdBy: mockUser };

      mockOccurrencesRepository.findOne.mockResolvedValue(occurrence);

      await expect(service.remove(occurrenceId, mockUser)).rejects.toThrow(ForbiddenException);
    });
  });
});
