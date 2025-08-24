/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';
import { Authority } from './entities/authority.entity';
import { User } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/enums/users-role.enum';

@Injectable()
export class AuthoritiesService {
  constructor(
    @InjectRepository(Authority)
    private authoritiesRepository: Repository<Authority>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createDto: CreateAuthorityDto): Promise<Authority> {
    const { userId, ...authorityData } = createDto;
    const authority = this.authoritiesRepository.create(authorityData);

    if (userId) {
      const user = await this.usersRepository.findOneBy({ id: userId });
      if (!user) { throw new NotFoundException(`Usuário com o ID "${userId}" não encontrado.`); }
      authority.user = user;
    }

    try {
      return await this.authoritiesRepository.save(authority);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new ConflictException('Erro de duplicidade. Verifique os dados.');
      }
      throw error;
    }
  }

  async findAll(): Promise<Authority[]> {
    return this.authoritiesRepository.find();
  }

  async findOne(id: string): Promise<Authority> {
    const authority = await this.authoritiesRepository.findOneBy({ id });
    if (!authority) { throw new NotFoundException(`Autoridade com o ID "${id}" não encontrada.`); }
    return authority;
  }

  async findOneByUserId(userId: string): Promise<Authority | null> {
    return this.authoritiesRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async update(id: string, updateDto: UpdateAuthorityDto): Promise<Authority> {
    const { userId, ...authorityData } = updateDto;
    const authority = await this.authoritiesRepository.preload({ id: id, ...authorityData });

    if (!authority) {
      throw new NotFoundException(`Autoridade com o ID "${id}" não encontrada.`);
    }

    if (userId) {
      const user = await this.usersRepository.findOneBy({ id: userId });
      if (!user) { throw new NotFoundException(`Usuário com o ID "${userId}" não encontrado.`); }
      authority.user = user;
    } else if (userId === null) {
      authority.user = undefined; // Desvincula o usuário
    }

    try {
      return await this.authoritiesRepository.save(authority);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new ConflictException('Erro de duplicidade. Verifique os dados.');
      }
      throw error;
    }
  }
  
  // ==========================================================
  // O MÉTODO 'remove' QUE ESTAVA MAL FORMATADO
  // ==========================================================
  async remove(id: string): Promise<void> {
    const result = await this.authoritiesRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Autoridade com o ID "${id}" não encontrada.`);
    }
  }

  // ==========================================================
  // OUVINTE DE EVENTO
  // ==========================================================
  @OnEvent('user.approved')
  async handleUserApprovedEvent(user: User) {
    console.log('--- [AuthoritiesService] Evento "user.approved" recebido para:', user.email);

    if (user.role === UserRole.DELEGADO) {
      const existingAuthority = await this.findOneByUserId(user.id);
      if (!existingAuthority) {
        console.log(`Criando entrada de Autoridade para o Delegado ${user.name}...`);
        await this.create({
          name: user.name,
          title: 'Delegado de Polícia',
          userId: user.id,
        });
        console.log(`Entrada de Autoridade criada com sucesso.`);
      }
    }
  }
}