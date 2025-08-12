// Arquivo: src/authorities/authorities.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthoritiesController } from './authorities.controller';
import { AuthoritiesService } from './authorities.service';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';
import { UserRole } from '../users/enums/users-role.enum';

// --- Mock do Serviço ---
const mockAuthoritiesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('AuthoritiesController', () => {
  let controller: AuthoritiesController;
  let service: AuthoritiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthoritiesController],
      providers: [
        {
          provide: AuthoritiesService,
          useValue: mockAuthoritiesService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<AuthoritiesController>(AuthoritiesController);
    service = module.get<AuthoritiesService>(AuthoritiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call authoritiesService.create with the correct data', async () => {
      const createDto: CreateAuthorityDto = { name: 'Delegado Teste', title: 'Delegado' };
      const expectedResult = { id: '1', ...createDto };
      mockAuthoritiesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  // --- Teste para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call authoritiesService.findAll', async () => {
      const expectedResult = [{ id: '1', name: 'Delegado Teste' }];
      mockAuthoritiesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // --- Teste para o endpoint 'findOne' (GET /:id) ---
  describe('findOne', () => {
    it('should call authoritiesService.findOne with the correct id', async () => {
      const authorityId = 'authority-id';
      const expectedResult = { id: authorityId, name: 'Delegado Teste' };
      mockAuthoritiesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(authorityId);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(authorityId);
    });
  });

  // --- Teste para o endpoint 'update' (PATCH /:id) ---
  describe('update', () => {
    it('should call authoritiesService.update with the correct id and dto', async () => {
      const authorityId = 'authority-id';
      const updateDto: UpdateAuthorityDto = { title: 'Delegado Chefe' };
      const expectedResult = { id: authorityId, title: 'Delegado Chefe' };
      mockAuthoritiesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(authorityId, updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(authorityId, updateDto);
    });
  });

  // --- Teste para o endpoint 'remove' (DELETE /:id) ---
  describe('remove', () => {
    it('should call authoritiesService.remove with the correct id', async () => {
      const authorityId = 'authority-id';
      mockAuthoritiesService.remove.mockResolvedValue(undefined); // O método remove não retorna nada

      await controller.remove(authorityId);

      expect(service.remove).toHaveBeenCalledWith(authorityId);
    });
  });
});
