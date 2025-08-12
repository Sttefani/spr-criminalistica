// Arquivo: src/users/users.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApproveUserDto } from './dto/approve-user.dto';
import { UserRole } from './enums/users-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';

// --- Mock do Serviço ---
// Criamos um objeto que simula todos os métodos do UsersService
const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findPending: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  approve: jest.fn(),
  reject: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call usersService.create with the correct data', async () => {
      const createUserDto: CreateUserDto = { name: 'Test', email: 'test@test.com', password: '123', cpf: '12345678900' };
      const expectedResult = { id: '1', ...createUserDto };
      mockUsersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  // --- Teste para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call usersService.findAll', async () => {
      const expectedResult = [{ id: '1', name: 'Test User' }];
      mockUsersService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'findPending' (GET /pending) ---
  describe('findPending', () => {
    it('should call usersService.findPending', async () => {
      const expectedResult = [{ id: '1', name: 'Pending User' }];
      mockUsersService.findPending.mockResolvedValue(expectedResult);

      const result = await controller.findPending();

      expect(result).toEqual(expectedResult);
      expect(service.findPending).toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'approveUser' (PATCH /:id/approve) ---
  describe('approveUser', () => {
    it('should call usersService.approve with the correct id and dto', async () => {
      const userId = 'user-id';
      const approveDto: ApproveUserDto = { role: UserRole.PERITO_OFICIAL };
      const expectedResult = { id: userId, role: UserRole.PERITO_OFICIAL };
      mockUsersService.approve.mockResolvedValue(expectedResult);

      const result = await controller.approveUser(userId, approveDto);

      expect(result).toEqual(expectedResult);
      expect(service.approve).toHaveBeenCalledWith(userId, approveDto);
    });
  });

  // --- Teste para o endpoint 'rejectUser' (PATCH /:id/reject) ---
  describe('rejectUser', () => {
    it('should call usersService.reject with the correct id', async () => {
      const userId = 'user-id';
      const expectedResult = { id: userId, status: 'REJECTED' };
      mockUsersService.reject.mockResolvedValue(expectedResult);

      const result = await controller.rejectUser(userId);

      expect(result).toEqual(expectedResult);
      expect(service.reject).toHaveBeenCalledWith(userId);
    });
  });
});
