// Arquivo: src/general-occurrences/general-occurrences.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { GeneralOccurrencesController } from './general-occurrences.controller';
import { GeneralOccurrencesService } from './general-occurrences.service';
import { CreateGeneralOccurrenceDto } from './dto/create-general-occurrence.dto';
import { UpdateGeneralOccurrenceDto } from './dto/update-general-occurrence.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';
import { User } from '../users/entities/users.entity';
import { UserRole } from '../users/enums/users-role.enum';

// --- Mock do Serviço ---
const mockOccurrencesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('GeneralOccurrencesController', () => {
  let controller: GeneralOccurrencesController;
  let service: GeneralOccurrencesService;

  const mockUser = { id: 'user-uuid', role: UserRole.PERITO_OFICIAL } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralOccurrencesController],
      providers: [
        {
          provide: GeneralOccurrencesService,
          useValue: mockOccurrencesService,
        },
      ],
    })
    // Mockamos os Guards para que não interfiram nos testes unitários
    .overrideGuard(AuthGuard('jwt')).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<GeneralOccurrencesController>(GeneralOccurrencesController);
    service = module.get<GeneralOccurrencesService>(GeneralOccurrencesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'create' (POST /) ---
  describe('create', () => {
    it('should call occurrencesService.create with the correct data', async () => {
      const createDto: CreateGeneralOccurrenceDto = { forensicServiceId: 'fs-uuid', cityId: 'city-uuid', occurrenceDate: new Date(), history: 'Test' };
      const mockRequest = { user: mockUser };
      const expectedResult = { id: '1', ...createDto };
      mockOccurrencesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser);
    });
  });

  // --- Teste para o endpoint 'findAll' (GET /) ---
  describe('findAll', () => {
    it('should call occurrencesService.findAll with the current user', async () => {
      const mockRequest = { user: mockUser };
      const expectedResult = [{ id: '1', history: 'Test' }];
      mockOccurrencesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(mockUser);
    });
  });

  // --- Teste para o endpoint 'findOne' (GET /:id) ---
  describe('findOne', () => {
    it('should call occurrencesService.findOne with the correct id and user', async () => {
      const occurrenceId = 'occurrence-id';
      const mockRequest = { user: mockUser };
      const expectedResult = { id: occurrenceId, history: 'Test' };
      mockOccurrencesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(occurrenceId, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(occurrenceId, mockUser);
    });
  });

  // --- Teste para o endpoint 'update' (PATCH /:id) ---
  describe('update', () => {
    it('should call occurrencesService.update with the correct id, dto, and user', async () => {
      const occurrenceId = 'occurrence-id';
      const updateDto: UpdateGeneralOccurrenceDto = { history: 'Updated history' };
      const mockRequest = { user: mockUser };
      const expectedResult = { id: occurrenceId, history: 'Updated history' };
      mockOccurrencesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(occurrenceId, updateDto, mockRequest);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(occurrenceId, updateDto, mockUser);
    });
  });

  // --- Teste para o endpoint 'remove' (DELETE /:id) ---
  describe('remove', () => {
    it('should call occurrencesService.remove with the correct id and user', async () => {
      const occurrenceId = 'occurrence-id';
      const mockRequest = { user: mockUser };
      mockOccurrencesService.remove.mockResolvedValue(undefined);

      await controller.remove(occurrenceId, mockRequest);

      expect(service.remove).toHaveBeenCalledWith(occurrenceId, mockUser);
    });
  });
});
