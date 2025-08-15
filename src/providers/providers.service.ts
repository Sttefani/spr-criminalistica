import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
  ) {}

  async create(createDto: CreateProviderDto): Promise<Provider> {
    try {
      const provider = this.providersRepository.create(createDto);
      return await this.providersRepository.save(provider);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Um fornecedor com este CNPJ já existe.');
      }
      throw error;
    }
  }

  async findAll(): Promise<Provider[]> {
    return this.providersRepository.find();
  }

  async findOne(id: string): Promise<Provider> {
    const provider = await this.providersRepository.findOneBy({ id });
    if (!provider) {
      throw new NotFoundException(`Fornecedor com o ID "${id}" não encontrado.`);
    }
    return provider;
  }

  async update(id: string, updateDto: UpdateProviderDto): Promise<Provider> {
    const provider = await this.providersRepository.preload({ id, ...updateDto });
    if (!provider) {
      throw new NotFoundException(`Fornecedor com o ID "${id}" não encontrado.`);
    }
    try {
      return await this.providersRepository.save(provider);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Um fornecedor com este CNPJ já existe.');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.providersRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fornecedor com o ID "${id}" não encontrado.`);
    }
  }
}

