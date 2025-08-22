/* eslint-disable prettier/prettier */
import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApproveUserDto } from './dto/approve-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { UserStatus } from './enums/users-status.enum';
import { UserRole } from './enums/users-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // MÉTODO CREATE: SEM hash manual - deixa o @BeforeInsert() da entity fazer
  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('=== DEBUG REGISTRO ===');
    console.log('Dados recebidos:', createUserDto);
    console.log('Senha original:', createUserDto.password);
    
    const userData = { ...createUserDto };
    
    if (userData.cpf) { 
      userData.cpf = userData.cpf.replace(/\D/g, ''); 
    }
  
    console.log('Dados preparados para criação:', { ...userData, password: '[SERÁ CRIPTOGRAFADA PELA ENTITY]' });
    
    const user = this.usersRepository.create(userData);
    
    try {
      const savedUser = await this.usersRepository.save(user);
      console.log('Usuário criado com sucesso:', { 
        id: savedUser.id, 
        email: savedUser.email, 
        status: savedUser.status 
      });
      return savedUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      if ((error as any).code === '23505') {
        throw new ConflictException('O e-mail ou CPF informado já está em uso.');
      }
      throw error;
    }
  }

  // MÉTODO FINDBYEMAIL: Para o login (com senha incluída)
  async findOneByEmail(email: string): Promise<User | null> {
    console.log('Buscando usuário pelo email:', email);
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
    
    console.log('Usuário encontrado:', user ? 'SIM' : 'NÃO');
    return user;
  }
  
  // ==========================================================
  // MÉTODOS DE CRUD
  // ==========================================================

  async findAll(page = 1, limit = 10, status?: UserStatus, search?: string): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const qb = this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.requestingUnits', 'requestingUnits')
      .leftJoinAndSelect('user.forensicServices', 'forensicServices');

    if (status) { 
      qb.andWhere('user.status = :status', { status }); 
    }
    
    if (search) {
      qb.andWhere('(LOWER(user.name) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))', { search: `%${search}%` });
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
      relations: ['requestingUnits', 'forensicServices'],
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
        throw new ConflictException('O e-mail ou CPF informado já está em uso por outro usuário.');
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
    console.log('=== DEBUG APROVAÇÃO ===');
    console.log('Aprovando usuário ID:', id);
    console.log('Role selecionado:', approveUserDto.role);
    
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) { 
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`); 
    }
    
    console.log('Usuário antes da aprovação:', {
      id: user.id,
      email: user.email,
      status: user.status,
      role: user.role
    });
    
    user.status = UserStatus.ACTIVE;
    user.role = approveUserDto.role;
    
    const approvedUser = await this.usersRepository.save(user);
    
    console.log('Usuário após aprovação:', {
      id: approvedUser.id,
      email: approvedUser.email,
      status: approvedUser.status,
      role: approvedUser.role
    });
    
    return approvedUser;
  }

  async reject(id: string): Promise<User> {
    console.log('=== DEBUG REJEIÇÃO ===');
    console.log('Rejeitando usuário ID:', id);
    
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) { 
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`); 
    }
    
    user.status = UserStatus.REJECTED;
    const rejectedUser = await this.usersRepository.save(user);
    
    console.log('Usuário rejeitado:', {
      id: rejectedUser.id,
      email: rejectedUser.email,
      status: rejectedUser.status
    });
    
    return rejectedUser;
  }
}