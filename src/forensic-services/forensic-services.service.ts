/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
// Arquivo: src/forensic-services/forensic-services.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateForensicServiceDto } from './dto/create-forensic-service.dto';
import { UpdateForensicServiceDto } from './dto/update-forensic-service.dto';
import { ForensicService } from './entities/forensic-service.entity';

@Injectable()
export class ForensicServicesService {
  constructor(
    @InjectRepository(ForensicService)
    private servicesRepository: Repository<ForensicService>,
  ) {}

  /**
   * Cria um novo serviço pericial.
   */
  async create(createDto: CreateForensicServiceDto): Promise<ForensicService> {
    try {
      const service = this.servicesRepository.create(createDto);
      return await this.servicesRepository.save(service);
    } catch (error) {
      // O erro '23505' é para violação de chave única no PostgreSQL
      if (error.code === '23505') {
        throw new ConflictException('Um serviço com este nome ou sigla já existe.');
      }
      throw error;
    }
  }

  /**
   * Retorna uma lista de todos os serviços periciais.
   */
  async findAll(): Promise<ForensicService[]> {
    return this.servicesRepository.find();
  }

  /**
   * NOVO MÉTODO: Retorna lista paginada de serviços periciais (para o frontend)
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: ForensicService[], total: number, page: number, limit: number }> {
    const skip = (page - 1) * limit;
    const whereConditions: any = {};

    if (search) {
      whereConditions.name = ILike(`%${search}%`);
    }

    const [data, total] = await this.servicesRepository.findAndCount({
      where: whereConditions,
      order: { name: 'ASC' },
      skip: skip,
      take: limit,
    });

    return { data, total, page, limit };
  }

  /**
   * Busca um serviço pericial específico pelo seu ID.
   */
  async findOne(id: string): Promise<ForensicService> {
    const service = await this.servicesRepository.findOneBy({ id });
    if (!service) {
      throw new NotFoundException(`Serviço pericial com o ID "${id}" não encontrado.`);
    }
    return service;
  }

  /**
   * Atualiza os dados de um serviço pericial.
   */
  async update(id: string, updateDto: UpdateForensicServiceDto): Promise<ForensicService> {
    const service = await this.servicesRepository.preload({
      id: id,
      ...updateDto,
    });
    if (!service) {
      throw new NotFoundException(`Serviço pericial com o ID "${id}" não encontrado.`);
    }
    try {
      return await this.servicesRepository.save(service);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Um serviço com este nome ou sigla já existe.');
      }
      throw error;
    }
  }

  /**
   * Remove um serviço pericial (usando soft delete).
   */
  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.servicesRepository.softDelete(service.id);
  }
}