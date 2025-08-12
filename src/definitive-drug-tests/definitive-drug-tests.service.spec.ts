// Arquivo: src/definitive-drug-tests/definitive-drug-tests.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { DefinitiveDrugTestsService } from './definitive-drug-tests.service';
import { DefinitiveDrugTest } from './entities/definitive-drug-test.entity';
import { PreliminaryDrugTest } from '../preliminary-drug-tests/entities/preliminary-drug-test.entity';
import { User } from '../users/entities/users.entity';
import { ExamType } from '../exam-types/entities/exam-type.entity';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateDefinitiveDrugTestDto } from './dto/create-definitive-drug-test.dto';
import { UserRole } from '../users/enums/users-role.enum';
import { UpdateDefinitiveDrugTestDto } from './dto/update-definitive-drug-test.dto';

// --- Mocks dos Repositórios ---
const mockDefinitiveRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  count: jest.fn(),
  merge: jest.fn(),
  softDelete: jest.fn(),
};

const mockPreliminaryRepository = {
  findOneBy: jest.fn(),
  manager: {
    transaction: jest.fn().mockImplementation(async (callback) => {
      const transactionalEntityManager = { save: jest.fn() };
      await callback(transactionalEntityManager);
    }),
  },
};

const mockUserRepository = {
  findOneBy: jest.fn(),
};

const mockExamTypeRepository = {
  findBy: jest.fn(),
};


describe('DefinitiveDrugTestsService', () => {
  let service: DefinitiveDrugTestsService;
  let definitiveRepository: Repository<DefinitiveDrugTest>;
  let preliminaryRepository: Repository<PreliminaryDrugTest>;
  let userRepository: Repository<User>;
  let examTypeRepository: Repository<ExamType>;

  const mockUser = { id: 'user-uuid', name: 'Test User', role: UserRole.PERITO_OFICIAL } as User;
  const mockAdmin = { id: 'admin-uuid', name: 'Admin User', role: UserRole.SUPER_ADMIN } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DefinitiveDrugTestsService,
        { provide: getRepositoryToken(DefinitiveDrugTest), useValue: mockDefinitiveRepository },
        { provide: getRepositoryToken(PreliminaryDrugTest), useValue: mockPreliminaryRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(ExamType), useValue: mockExamTypeRepository },
      ],
    }).compile();

    service = module.get<DefinitiveDrugTestsService>(DefinitiveDrugTestsService);
    definitiveRepository = module.get<Repository<DefinitiveDrugTest>>(getRepositoryToken(DefinitiveDrugTest));
    preliminaryRepository = module.get<Repository<PreliminaryDrugTest>>(getRepositoryToken(PreliminaryDrugTest));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    examTypeRepository = module.get<Repository<ExamType>>(getRepositoryToken(ExamType));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create a definitive drug test successfully', async () => {
      const createDto: CreateDefinitiveDrugTestDto = { preliminaryTestId: 'prelim-uuid', expertId: 'expert-uuid', analysisResult: 'Positivo', techniqueIds: ['tech-uuid'] };
      const preliminaryTest = { id: 'prelim-uuid', isLocked: false };
      const expert = { id: 'expert-uuid' };
      const techniques = [{ id: 'tech-uuid', name: 'GC-MS' }];
      const newTest = { ...createDto };

      mockPreliminaryRepository.findOneBy.mockResolvedValue(preliminaryTest);
      mockDefinitiveRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.findOneBy.mockResolvedValue(expert);
      mockExamTypeRepository.findBy.mockResolvedValue(techniques);
      mockDefinitiveRepository.count.mockResolvedValue(0);
      mockDefinitiveRepository.create.mockReturnValue(newTest as any);

      await service.create(createDto, mockUser);

      expect(preliminaryRepository.manager.transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if preliminary test is not found', async () => {
      mockPreliminaryRepository.findOneBy.mockResolvedValue(null);
      await expect(service.create({} as any, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if definitive test already exists', async () => {
        mockPreliminaryRepository.findOneBy.mockResolvedValue({ id: 'prelim-uuid' });
        mockDefinitiveRepository.findOneBy.mockResolvedValue({ id: 'definitive-uuid' });
        await expect(service.create({ preliminaryTestId: 'prelim-uuid' } as any, mockUser)).rejects.toThrow(ConflictException);
    });
  });

  // --- Testes para o método 'update' ---
  describe('update', () => {
    it('should update a test successfully by the owner', async () => {
        const testId = 'definitive-uuid';
        const updateDto: UpdateDefinitiveDrugTestDto = { analysisResult: 'Negativo' };
        const existingTest = { id: testId, isLocked: false, createdBy: mockUser };
      
        mockDefinitiveRepository.findOne.mockResolvedValue(existingTest);
        mockDefinitiveRepository.merge.mockReturnValue({ ...existingTest, ...updateDto } as any);
        mockDefinitiveRepository.save.mockResolvedValue({ ...existingTest, ...updateDto } as any);
      
        const result = await service.update(testId, updateDto, mockUser);
      
        expect(result.analysisResult).toEqual('Negativo');
        expect(definitiveRepository.save).toHaveBeenCalled();
      });

      it('should throw ForbiddenException if test is locked and user is not admin', async () => {
        const testId = 'definitive-uuid';
        const existingTest = { id: testId, isLocked: true, createdBy: mockUser };
      
        mockDefinitiveRepository.findOne.mockResolvedValue(existingTest);
      
        await expect(service.update(testId, {}, mockUser)).rejects.toThrow(ForbiddenException);
      });

      it('should throw ForbiddenException if user is not the owner or admin', async () => {
        const testId = 'definitive-uuid';
        const anotherUser = { id: 'another-user-uuid', role: UserRole.PERITO_OFICIAL } as User;
        const existingTest = { id: testId, isLocked: false, createdBy: anotherUser };
      
        mockDefinitiveRepository.findOne.mockResolvedValue(existingTest);
      
        await expect(service.update(testId, {}, mockUser)).rejects.toThrow(ForbiddenException);
      });

      it('should allow an admin to update a locked test', async () => {
        const testId = 'definitive-uuid';
        const updateDto: UpdateDefinitiveDrugTestDto = { analysisResult: 'Atualizado por Admin' };
        const existingTest = { id: testId, isLocked: true, createdBy: mockUser };
      
        mockDefinitiveRepository.findOne.mockResolvedValue(existingTest);
        mockDefinitiveRepository.merge.mockReturnValue({ ...existingTest, ...updateDto } as any);
        mockDefinitiveRepository.save.mockResolvedValue({ ...existingTest, ...updateDto } as any);
      
        const result = await service.update(testId, updateDto, mockAdmin);
      
        expect(result.analysisResult).toEqual('Atualizado por Admin');
        expect(definitiveRepository.save).toHaveBeenCalled();
      });
  });

  // --- Testes para o método 'findOne' ---
  describe('findOne', () => {
    it('should return a test if found', async () => {
      const testId = 'definitive-uuid';
      const expectedTest = { id: testId, analysisResult: 'Positivo' };
      mockDefinitiveRepository.findOne.mockResolvedValue(expectedTest);

      const result = await service.findOne(testId);

      expect(result).toEqual(expectedTest);
    });

    it('should throw NotFoundException if test is not found', async () => {
      mockDefinitiveRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
