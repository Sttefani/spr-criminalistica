// Arquivo: src/authorities/authorities.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

import { AuthoritiesService } from './authorities.service';
import { Authority } from './entities/authority.entity';
import { User } from '../users/entities/users.entity';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';

// --- Mocks dos Repositórios ---
const mockAuthoritiesRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  softDelete: jest.fn(),
};

const mockUsersRepository = {
  findOneBy: jest.fn(),
};

describe('AuthoritiesService', () => {
  let service: AuthoritiesService;
  let authorityRepository: Repository<Authority>;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthoritiesService,
        {
          provide: getRepositoryToken(Authority),
          useValue: mockAuthoritiesRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<AuthoritiesService>(AuthoritiesService);
    authorityRepository = module.get<Repository<Authority>>(getRepositoryToken(Authority));
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método 'create' ---
  describe('create', () => {
    it('should create an authority successfully', async () => {
      const createDto: CreateAuthorityDto = { name: 'Delegado Teste', title: 'Delegado de Polícia' };
      const authorityEntity = { id: 'some-uuid', ...createDto };

      mockAuthoritiesRepository.create.mockReturnValue(authorityEntity);
      mockAuthoritiesRepository.save.mockResolvedValue(authorityEntity);

      const result = await service.create(createDto);

      expect(result).toEqual(authorityEntity);
      expect(authorityRepository.create).toHaveBeenCalledWith({ name: 'Delegado Teste', title: 'Delegado de Polícia' });
      expect(authorityRepository.save).toHaveBeenCalledWith(authorityEntity);
    });

    it('should throw NotFoundException if associated user does not exist', async () => {
      const createDto: CreateAuthorityDto = { name: 'Delegado Teste', title: 'Delegado de Polícia', userId: 'non-existent-user-id' };
      
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'findOne' ---
  describe('findOne', () => {
    it('should return an authority if found', async () => {
      const authorityId = 'some-uuid';
      const expectedAuthority = { id: authorityId, name: 'Delegado Teste' };

      mockAuthoritiesRepository.findOneBy.mockResolvedValue(expectedAuthority);

      const result = await service.findOne(authorityId);

      expect(result).toEqual(expectedAuthority);
      expect(authorityRepository.findOneBy).toHaveBeenCalledWith({ id: authorityId });
    });

    it('should throw NotFoundException if authority is not found', async () => {
      mockAuthoritiesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'update' ---
  describe('update', () => {
    it('should update an authority successfully', async () => {
      const authorityId = 'some-uuid';
      const updateDto: UpdateAuthorityDto = { name: 'Delegado Atualizado' };
      const existingAuthority = { id: authorityId, name: 'Delegado Antigo' };
      const updatedAuthority = { ...existingAuthority, ...updateDto };

      mockAuthoritiesRepository.preload.mockResolvedValue(updatedAuthority);
      mockAuthoritiesRepository.save.mockResolvedValue(updatedAuthority);

      const result = await service.update(authorityId, updateDto);

      expect(result).toEqual(updatedAuthority);
      expect(authorityRepository.preload).toHaveBeenCalledWith({ id: authorityId, ...updateDto });
      expect(authorityRepository.save).toHaveBeenCalledWith(updatedAuthority);
    });

    it('should throw NotFoundException if authority to update is not found', async () => {
      mockAuthoritiesRepository.preload.mockResolvedValue(null);

      await expect(service.update('non-existent-id', { name: 'Novo Nome' })).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método 'remove' ---
  describe('remove', () => {
    it('should soft delete an authority', async () => {
      const authorityId = 'some-uuid';
      const authority = { id: authorityId, name: 'Delegado a ser removido' };

      // findOne é chamado dentro do remove, então precisamos mocká-lo
      mockAuthoritiesRepository.findOneBy.mockResolvedValue(authority); 
      mockAuthoritiesRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(authorityId);

      expect(authorityRepository.softDelete).toHaveBeenCalledWith(authorityId);
    });

    it('should throw NotFoundException if authority to remove is not found', async () => {
      mockAuthoritiesRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
