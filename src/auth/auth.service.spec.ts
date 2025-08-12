// Arquivo: src/auth/auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/enums/users-role.enum'; // Caminho corrigido para ser relativo

// --- Mock do Módulo bcrypt ---
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

// --- Mocks dos Serviços ---
const mockUsersService = {
  findOneByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

// --- Suíte de Testes Principal ---
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método validateUser ---
  describe('validateUser', () => {
    it('should return user data without password when credentials are valid', async () => {
      const userEmail = 'test@example.com';
      const userPassword = 'password123';
      const mockUser = { id: 'some-uuid', name: 'Test User', email: userEmail, password: 'hashedPassword' } as User;

      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(userEmail, userPassword);

      expect(result).toBeDefined();
      expect(result.email).toEqual(userEmail);
      expect(result.password).toBeUndefined();
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(userEmail);
    });

    it('should return null when password is invalid', async () => {
      const userEmail = 'test@example.com';
      const userPassword = 'wrongPassword';
      const mockUser = { id: 'some-uuid', name: 'Test User', email: userEmail, password: 'hashedPassword' } as User;

      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(userEmail, userPassword);

      expect(result).toBeNull();
    });

    it('should return null when user is not found', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });

  // --- Testes para o método login ---
  describe('login', () => {
    it('should return an access token when given a valid user object', async () => {
      const mockUser = {
        id: 'some-uuid',
        name: 'Test User',
        role: UserRole.PERITO_OFICIAL,
      };
      
      const expectedToken = 'mockAccessToken';
      const expectedPayload = {
        sub: mockUser.id,
        name: mockUser.name,
        role: mockUser.role,
      };

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({
        access_token: expectedToken,
      });
    });
  });
}); // <--- Fim da Suíte de Testes Principal