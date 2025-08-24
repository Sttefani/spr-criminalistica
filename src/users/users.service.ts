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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userData = { ...createUserDto };
    if (userData.cpf) { userData.cpf = userData.cpf.replace(/\D/g, ''); }
    const user = this.usersRepository.create(userData);
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new ConflictException('O e-mail ou CPF informado já está em uso.');
      }
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.createQueryBuilder('user').where('user.email = :email', { email }).addSelect('user.password').getOne();
  }

  async findAll(page = 1, limit = 10, status?: UserStatus, search?: string): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const qb = this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.requestingUnits', 'requestingUnits')
      .leftJoinAndSelect('user.forensicServices', 'forensicServices')
      .leftJoinAndSelect('user.authority', 'authority');

    if (status) { qb.andWhere('user.status = :status', { status }); }
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
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['requestingUnits', 'forensicServices', 'authority'] });
    if (!user) { throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`); }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.preload({ id, ...updateUserDto });
    if (!user) { throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`); }
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
    if (!user) { throw new NotFoundException(`Usuário com ID ${id} não encontrado`); }
    if (user.role === UserRole.SUPER_ADMIN) { throw new ForbiddenException('Não é possível deletar um Super Administrador'); }
    await this.usersRepository.softDelete(id);
  }

  async approve(id: string, approveUserDto: ApproveUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) { throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`); }
    
    user.status = UserStatus.ACTIVE;
    user.role = approveUserDto.role;
    const approvedUser = await this.usersRepository.save(user);

    // Emite o evento 'user.approved' com os dados do usuário aprovado
    this.eventEmitter.emit('user.approved', approvedUser);
    
    return approvedUser;
  }

  async reject(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) { throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`); }
    user.status = UserStatus.REJECTED;
    return await this.usersRepository.save(user);
  }
}