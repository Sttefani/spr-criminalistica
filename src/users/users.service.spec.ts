// Arquivo: src/users/users.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ApproveUserDto } from './dto/approve-user.dto';
import { UserStatus } from './enums/users-status.enum';
import { UserRole } from './enums/users-role.enum';

// --- Mock do Repositório ---
// Criamos um objeto que simula os métodos que o UsersService usa do repositório
const mockUsersRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User), // Pega o token de injeção para o repositório User
          useValue: mockUsersRepository,   // Usa nosso mock no lugar do repositório real
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa todos os mocks após cada teste
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create and return a user successfully', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password', name: 'Test', cpf: '12345678900' };
      const userEntity = { ...createUserDto, id: 'some-uuid' };

      mockUsersRepository.create.mockReturnValue(userEntity);
      mockUsersRepository.save.mockResolvedValue(userEntity);

      const result = await service.create(createUserDto);

      expect(result).toEqual({ ...userEntity, password: undefined }); // Verifica se a senha foi removida
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(userEntity);
    });

    it('should throw a ConflictException if email or CPF already exists', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password', name: 'Test', cpf: '12345678900' };
      
      // Simula o erro de violação de chave única do banco de dados
      mockUsersRepository.save.mockRejectedValue({ code: '23505' }); 

      // Esperamos que o método lance uma exceção do tipo ConflictException
      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  // --- Testes para o método 'approve' ---
  describe('approve', () => {
    it('should approve a user and change their status and role', async () => {
      const userId = 'some-uuid';
      const approveUserDto: ApproveUserDto = { role: UserRole.PERITO_OFICIAL };
      const user = { id: userId, status: UserStatus.PENDING, role: null, password: 'hashedPassword' };

      mockUsersRepository.findOneBy.mockResolvedValue(user);
      mockUsersRepository.save.mockImplementation(updatedUser => Promise.resolve(updatedUser));

      const result = await service.approve(userId, approveUserDto);

      expect(result.status).toBe(UserStatus.ACTIVE);
      expect(result.role).toBe(UserRole.PERITO_OFICIAL);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ status: UserStatus.ACTIVE, role: UserRole.PERITO_OFICIAL }));
    });

    it('should throw a NotFoundException if user to approve is not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.approve('non-existent-id', { role: UserRole.PERITO_OFICIAL })).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'reject' ---
  describe('reject', () => {
    it('should reject a user and change their status to REJECTED', async () => {
      const userId = 'some-uuid';
      const user = { id: userId, status: UserStatus.PENDING, password: 'hashedPassword' };

      mockUsersRepository.findOneBy.mockResolvedValue(user);
      mockUsersRepository.save.mockImplementation(updatedUser => Promise.resolve(updatedUser));

      const result = await service.reject(userId);

      expect(result.status).toBe(UserStatus.REJECTED);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ status: UserStatus.REJECTED }));
    });

    it('should throw a NotFoundException if user to reject is not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.reject('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
