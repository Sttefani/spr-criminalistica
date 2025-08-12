// Arquivo: src/authorities/authorities.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';
import { Authority } from './entities/authority.entity';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class AuthoritiesService {
  constructor(
    @InjectRepository(Authority)
    private authoritiesRepository: Repository<Authority>,
    // Precisamos do repositório de User para validar o userId
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Cria uma nova autoridade.
   */
  async create(createDto: CreateAuthorityDto): Promise<Authority> {
    const { userId, ...authorityData } = createDto;
    
    const authority = this.authoritiesRepository.create(authorityData);

    if (userId) {
      const user = await this.usersRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`Usuário com o ID "${userId}" não encontrado.`);
      }
      authority.user = user;
    }

    try {
      return await this.authoritiesRepository.save(authority);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Erro de duplicidade. Verifique os dados.');
      }
      throw error;
    }
  }

  /**
   * Retorna uma lista de todas as autoridades.
   */
  async findAll(): Promise<Authority[]> {
    return this.authoritiesRepository.find();
  }

  /**
   * Busca uma autoridade específica pelo seu ID.
   */
  async findOne(id: string): Promise<Authority> {
    const authority = await this.authoritiesRepository.findOneBy({ id });
    if (!authority) {
      throw new NotFoundException(`Autoridade com o ID "${id}" não encontrada.`);
    }
    return authority;
  }

  /**
   * Atualiza os dados de uma autoridade.
   */
  async update(id: string, updateDto: UpdateAuthorityDto): Promise<Authority> {
    const { userId, ...authorityData } = updateDto;
    
    const authority = await this.authoritiesRepository.preload({
      id: id,
      ...authorityData,
    });

    if (!authority) {
      throw new NotFoundException(`Autoridade com o ID "${id}" não encontrada.`);
    }

    if (userId) {
      const user = await this.usersRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`Usuário com o ID "${userId}" não encontrado.`);
      }
      authority.user = user;
    }

    try {
      return await this.authoritiesRepository.save(authority);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Erro de duplicidade. Verifique os dados.');
      }
      throw error;
    }
  }

  /**
   * Remove uma autoridade (usando soft delete).
   */
  async remove(id: string): Promise<void> {
    const authority = await this.findOne(id);
    await this.authoritiesRepository.softDelete(authority.id);
  }
}
