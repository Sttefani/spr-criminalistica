// Arquivo: src/preliminary-drug-tests/preliminary-drug-tests.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

import { PreliminaryDrugTestsService } from './preliminary-drug-tests.service';
import { PreliminaryDrugTest, CaseStatus } from './entities/preliminary-drug-test.entity';
import { User } from '../users/entities/users.entity';
import { Procedure } from '../procedures/entities/procedure.entity';
import { OccurrenceClassification } from '../occurrence-classifications/entities/occurrence-classification.entity';
import { RequestingUnit } from '../requesting-units/entities/requesting-unit.entity';
import { Authority } from '../authorities/entities/authority.entity';
import { City } from '../cities/entities/city.entity';
import { ForensicService } from '../forensic-services/entities/forensic-service.entity';
import { CreatePreliminaryDrugTestDto } from './dto/create-preliminary-drug-test.dto';
import { UserRole } from '../users/enums/users-role.enum';
import { SendToLabDto } from './dto/send-to-lab.dto';

// --- Mocks dos Repositórios ---
const mockPdtRepository = { create: jest.fn(), save: jest.fn(), count: jest.fn(), findOne: jest.fn(), findOneBy: jest.fn(), softDelete: jest.fn(), merge: jest.fn() };
const mockProcedureRepository = { findOneBy: jest.fn() };
const mockClassificationRepository = { findOneBy: jest.fn() };
const mockUserRepository = { findOneBy: jest.fn() };
const mockUnitRepository = { findOneBy: jest.fn() };
const mockAuthorityRepository = { findOneBy: jest.fn() };
const mockCityRepository = { findOneBy: jest.fn() };
const mockForensicServiceRepository = { findOneBy: jest.fn() };

describe('PreliminaryDrugTestsService', () => {
  let service: PreliminaryDrugTestsService;
  let pdtRepository: Repository<PreliminaryDrugTest>;

  const mockUser = { id: 'user-uuid', role: UserRole.PERITO_OFICIAL } as User;
  const mockAdmin = { id: 'admin-uuid', role: UserRole.SUPER_ADMIN } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreliminaryDrugTestsService,
        { provide: getRepositoryToken(PreliminaryDrugTest), useValue: mockPdtRepository },
        { provide: getRepositoryToken(Procedure), useValue: mockProcedureRepository },
        { provide: getRepositoryToken(OccurrenceClassification), useValue: mockClassificationRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(RequestingUnit), useValue: mockUnitRepository },
        { provide: getRepositoryToken(Authority), useValue: mockAuthorityRepository },
        { provide: getRepositoryToken(City), useValue: mockCityRepository },
        { provide: getRepositoryToken(ForensicService), useValue: mockForensicServiceRepository },
      ],
    }).compile();

    service = module.get<PreliminaryDrugTestsService>(PreliminaryDrugTestsService);
    pdtRepository = module.get<Repository<PreliminaryDrugTest>>(getRepositoryToken(PreliminaryDrugTest));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create a preliminary drug test successfully', async () => {
      const createDto: CreatePreliminaryDrugTestDto = {
        procedureId: 'proc-uuid',
        occurrenceClassificationId: 'class-uuid',
        responsibleExpertId: 'expert-uuid',
        requestingUnitId: 'unit-uuid',
        requestingAuthorityId: 'auth-uuid',
        cityId: 'city-uuid',
        // ... outros campos do DTO
      } as any;
      const newPdt = { id: 'pdt-uuid', ...createDto };

      // Mock all successful lookups
      mockProcedureRepository.findOneBy.mockResolvedValue({ id: 'proc-uuid' });
      mockClassificationRepository.findOneBy.mockResolvedValue({ id: 'class-uuid' });
      mockUserRepository.findOneBy.mockResolvedValue({ id: 'expert-uuid' });
      mockUnitRepository.findOneBy.mockResolvedValue({ id: 'unit-uuid' });
      mockAuthorityRepository.findOneBy.mockResolvedValue({ id: 'auth-uuid' });
      mockCityRepository.findOneBy.mockResolvedValue({ id: 'city-uuid' });
      mockPdtRepository.count.mockResolvedValue(0);
      mockPdtRepository.create.mockReturnValue(newPdt);
      mockPdtRepository.save.mockResolvedValue(newPdt);

      const result = await service.create(createDto, mockUser);

      expect(result).toEqual(newPdt);
      expect(pdtRepository.save).toHaveBeenCalledWith(newPdt);
    });
  });

  // --- Testes para o método 'sendToLab' ---
  describe('sendToLab', () => {
    it('should send a case to the lab successfully', async () => {
      const pdtId = 'pdt-uuid';
      const sendToLabDto: SendToLabDto = { forensicServiceId: 'fs-uuid' };
      const pdt = { id: pdtId, caseStatus: CaseStatus.PRELIMINARY_DONE };
      const forensicService = { id: 'fs-uuid' };

      mockPdtRepository.findOneBy.mockResolvedValue(pdt);
      mockForensicServiceRepository.findOneBy.mockResolvedValue(forensicService);
      mockPdtRepository.save.mockImplementation(updatedPdt => Promise.resolve(updatedPdt));

      const result = await service.sendToLab(pdtId, sendToLabDto);

      expect(result.caseStatus).toBe(CaseStatus.IN_LAB_ANALYSIS);
      expect(result.definitiveService).toEqual(forensicService);
      expect(pdtRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if case status is not PRELIMINARY_DONE', async () => {
      const pdt = { id: 'pdt-uuid', caseStatus: CaseStatus.IN_LAB_ANALYSIS }; // CORREÇÃO: Usando um status válido que não seja PRELIMINARY_DONE
      mockPdtRepository.findOneBy.mockResolvedValue(pdt);

      await expect(service.sendToLab('pdt-uuid', {} as any)).rejects.toThrow(BadRequestException);
    });
  });

  // --- Testes para o método 'update' ---
  describe('update', () => {
    it('should throw ForbiddenException if test is locked and user is not admin', async () => {
      const pdt = { id: 'pdt-uuid', isLocked: true, createdBy: mockUser };
      mockPdtRepository.findOne.mockResolvedValue(pdt);

      await expect(service.update('pdt-uuid', {}, mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should allow an admin to update a locked test', async () => {
      const pdt = { id: 'pdt-uuid', isLocked: true, createdBy: mockUser };
      const updatedPdt = { ...pdt, substanceDescription: 'Updated by admin' };
      
      mockPdtRepository.findOne.mockResolvedValue(pdt);
      mockPdtRepository.merge.mockReturnValue(updatedPdt);
      mockPdtRepository.save.mockResolvedValue(updatedPdt);

      const result = await service.update('pdt-uuid', { substanceDescription: 'Updated by admin' }, mockAdmin);

      expect(result.substanceDescription).toBe('Updated by admin');
    });
  });
});
