// Arquivo: src/requested-exams/requested-exams.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

import { RequestedExamsService } from './requested-exams.service';
import { RequestedExam, RequestedExamStatus } from './entities/requested-exam.entity';
import { GeneralOccurrence } from '../general-occurrences/entities/general-occurrence.entity';
import { ExamType } from '../exam-types/entities/exam-type.entity';
import { User } from '../users/entities/users.entity';
import { CreateRequestedExamDto } from './dto/create-requested-exam.dto';
import { UserRole } from '../users/enums/users-role.enum';

// --- Mocks dos Repositórios ---
const mockRequestedExamsRepository = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), merge: jest.fn(), delete: jest.fn() };
const mockOccurrencesRepository = { findOneBy: jest.fn() };
const mockExamTypesRepository = { findOneBy: jest.fn() };
const mockUsersRepository = { findOneBy: jest.fn() };

describe('RequestedExamsService', () => {
  let service: RequestedExamsService;
  let requestedExamsRepository: Repository<RequestedExam>;

  const mockUser = { id: 'user-uuid', role: UserRole.PERITO_OFICIAL } as User;
  const mockAdmin = { id: 'admin-uuid', role: UserRole.SUPER_ADMIN } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestedExamsService,
        { provide: getRepositoryToken(RequestedExam), useValue: mockRequestedExamsRepository },
        { provide: getRepositoryToken(GeneralOccurrence), useValue: mockOccurrencesRepository },
        { provide: getRepositoryToken(ExamType), useValue: mockExamTypesRepository },
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<RequestedExamsService>(RequestedExamsService);
    requestedExamsRepository = module.get<Repository<RequestedExam>>(getRepositoryToken(RequestedExam));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create a requested exam successfully', async () => {
      const createDto: CreateRequestedExamDto = { occurrenceId: 'occ-uuid', examTypeId: 'exam-uuid', assignedExpertId: 'expert-uuid' };
      const newExam = { ...createDto, id: 'req-exam-uuid' };

      mockOccurrencesRepository.findOneBy.mockResolvedValue({ id: 'occ-uuid' });
      mockExamTypesRepository.findOneBy.mockResolvedValue({ id: 'exam-uuid' });
      mockUsersRepository.findOneBy.mockResolvedValue({ id: 'expert-uuid' });
      mockRequestedExamsRepository.create.mockReturnValue(newExam as any);
      mockRequestedExamsRepository.save.mockResolvedValue(newExam as any);

      const result = await service.create(createDto, mockUser);

      expect(result).toEqual(newExam);
      expect(requestedExamsRepository.save).toHaveBeenCalledWith(newExam);
    });

    it('should throw NotFoundException if occurrence is not found', async () => {
      mockOccurrencesRepository.findOneBy.mockResolvedValue(null);
      await expect(service.create({} as any, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'update' ---
  describe('update', () => {
    it('should allow an assigned expert to update an exam', async () => {
      const examId = 'req-exam-uuid';
      const exam = { id: examId, assignedExpert: mockUser };
      const updatedExam = { ...exam, status: RequestedExamStatus.IN_PROGRESS };

      mockRequestedExamsRepository.findOne.mockResolvedValue(exam);
      mockRequestedExamsRepository.merge.mockReturnValue(updatedExam as any);
      mockRequestedExamsRepository.save.mockResolvedValue(updatedExam as any);

      const result = await service.update(examId, { status: RequestedExamStatus.IN_PROGRESS }, mockUser);

      expect(result.status).toBe(RequestedExamStatus.IN_PROGRESS);
    });

    it('should throw ForbiddenException if user is not the assigned expert or admin', async () => {
      const anotherUser = { id: 'another-user-uuid' } as User;
      const exam = { id: 'req-exam-uuid', assignedExpert: anotherUser };

      mockRequestedExamsRepository.findOne.mockResolvedValue(exam);

      await expect(service.update('req-exam-uuid', {}, mockUser)).rejects.toThrow(ForbiddenException);
    });
  });

  // --- Testes para o método 'remove' ---
  describe('remove', () => {
    it('should throw ForbiddenException if a non-admin tries to remove a non-pending exam', async () => {
      const exam = { id: 'req-exam-uuid', status: RequestedExamStatus.COMPLETED };
      
      // O remove chama o findOne, então mockamos o findOne
      mockRequestedExamsRepository.findOne.mockResolvedValue(exam);

      await expect(service.remove('req-exam-uuid', mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should allow an admin to remove a non-pending exam', async () => {
      const exam = { id: 'req-exam-uuid', status: RequestedExamStatus.COMPLETED };

      mockRequestedExamsRepository.findOne.mockResolvedValue(exam);
      mockRequestedExamsRepository.delete.mockResolvedValue({ affected: 1 });

      // O método deve completar sem lançar erro
      await expect(service.remove('req-exam-uuid', mockAdmin)).resolves.toBeUndefined();
      expect(requestedExamsRepository.delete).toHaveBeenCalledWith('req-exam-uuid');
    });
  });
});
