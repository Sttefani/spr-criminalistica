/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApproveUserDto } from './dto/approve-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { UserStatus } from './enums/users-status.enum';
import { UserRole } from './enums/users-role.enum';
import { GeneralOccurrence } from 'src/general-occurrences/entities/general-occurrence.entity';
import { OccurrenceStatus } from 'src/general-occurrences/enums/occurrence-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(GeneralOccurrence)
    private occurrenceRepository: Repository<GeneralOccurrence>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userData = { ...createUserDto };
    if (userData.cpf) {
      userData.cpf = userData.cpf.replace(/\D/g, '');
    }
    const user = this.usersRepository.create(userData);
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new ConflictException(
          'O e-mail ou CPF informado já está em uso.',
        );
      }
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: UserStatus,
    search?: string,
    role?: string, // Aceita 'role' como uma string simples
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.requestingUnits', 'requestingUnits')
      .leftJoinAndSelect('user.forensicServices', 'forensicServices')
      .leftJoinAndSelect('user.authority', 'authority');

    if (status) {
      qb.andWhere('user.status = :status', { status });
    }
    if (search) {
      qb.andWhere(
        '(LOWER(user.name) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    if (role) {
      qb.andWhere('user.role = :role', { role }); // Usa a string para filtrar no banco
    }

    qb.orderBy('user.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findPending(): Promise<User[]> {
    return this.usersRepository.find({ where: { status: UserStatus.PENDING } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['requestingUnits', 'forensicServices', 'authority'],
    });
    if (!user) {
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
    }
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new ConflictException(
          'O e-mail ou CPF informado já está em uso por outro usuário.',
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Não é possível deletar um Super Administrador');
    }
    await this.usersRepository.softDelete(id);
  }

  async approve(id: string, approveUserDto: ApproveUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
    }

    user.status = UserStatus.ACTIVE;
    user.role = approveUserDto.role;
    const approvedUser = await this.usersRepository.save(user);

    this.eventEmitter.emit('user.approved', approvedUser);

    return approvedUser;
  }

  async reject(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
    }
    user.status = UserStatus.REJECTED;
    return await this.usersRepository.save(user);
  }

  // ==========================================================
  // MÉTODOS PARA GERENCIAR SERVIÇOS FORENSES
  // ==========================================================

  async getUserForensicServices(userId: string, requestingUser?: any): Promise<User> {
  // Se não for super admin, só pode ver seus próprios serviços
  if (requestingUser && requestingUser.role !== 'super_admin' && requestingUser.id !== userId) {
    throw new ForbiddenException('Você só pode ver seus próprios serviços');
  }

  const user = await this.usersRepository.findOne({
    where: { id: userId },
    relations: ['forensicServices'],
  });
  
  if (!user) {
    throw new NotFoundException(`Usuário com ID "${userId}" não encontrado.`);
  }
  
  return user;
}

  async linkUserToForensicServices(userId: string, forensicServiceIds: string[]): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['forensicServices'],
    });
    
    if (!user) {
      throw new NotFoundException(`Usuário com ID "${userId}" não encontrado.`);
    }
    
    // Adicionar novos serviços (sem remover os existentes)
    const newServices = forensicServiceIds.map(id => ({ id } as any));
    const existingServiceIds = user.forensicServices?.map(fs => fs.id) || [];
    
    // Filtrar apenas serviços que ainda não estão vinculados
    const servicesToAdd = newServices.filter(service => 
      !existingServiceIds.includes(service.id)
    );
    
    if (servicesToAdd.length > 0) {
      user.forensicServices = [...(user.forensicServices || []), ...servicesToAdd];
      await this.usersRepository.save(user);
    }
    
    console.log(`Vinculado ${servicesToAdd.length} serviços ao usuário ${user.name}`);
    
    return this.findOne(userId);
  }

  async unlinkUserFromForensicService(userId: string, serviceId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['forensicServices'],
    });
    
    if (!user) {
      throw new NotFoundException(`Usuário com ID "${userId}" não encontrado.`);
    }
    
    // Remover o serviço da lista
    user.forensicServices = user.forensicServices?.filter(fs => fs.id !== serviceId) || [];
    await this.usersRepository.save(user);
    
    // SE FOR PERITO: Remover de casos ativos e voltar para pool
    if (user.role === UserRole.PERITO_OFICIAL) {
      await this.removeExpertFromActiveCases(userId, serviceId);
    }
    
    console.log(`Desvinculado serviço ${serviceId} do usuário ${user.name}`);
    
    return this.findOne(userId);
  }

  private async removeExpertFromActiveCases(expertId: string, serviceId: string): Promise<void> {
    // Buscar casos onde o perito é responsável neste serviço
    const affectedCases = await this.occurrenceRepository.find({
      where: {
        responsibleExpert: { id: expertId },
        forensicService: { id: serviceId },
      },
    });
    
    if (affectedCases.length > 0) {
      // Remover perito e voltar para status AGUARDANDO_PERITO
      await this.occurrenceRepository.update(
        { 
          responsibleExpert: { id: expertId },
          forensicService: { id: serviceId }
        },
        {
          responsibleExpert: null,
          status: OccurrenceStatus.PENDING
        }
      );
      
      console.log(`Removido perito de ${affectedCases.length} casos. Status alterado para AGUARDANDO_PERITO.`);
    }
  }
}