// DENTRO DE: src/users/users.service.ts

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ApproveUserDto } from './dto/approve-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { UserStatus } from './enums/users-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const user = this.usersRepository.create(createUserDto);
    try {
      const savedUser = await this.usersRepository.save(user);
      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('O e-mail ou CPF informado já está em uso.');
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

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findPending(): Promise<User[]> {
    return this.usersRepository.find({
      where: { status: UserStatus.PENDING },
    });
  }

  // --- MÉTODO findOne CORRIGIDO ---
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
    }
    // Omitimos a senha por padrão no retorno
    const { password, ...result } = user;
    return result as User;
  }

  // O método update ainda está como placeholder, podemos arrumar depois
  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async approve(id: string, approveUserDto: ApproveUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
    }
    user.status = UserStatus.ACTIVE;
    user.role = approveUserDto.role;
    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;
    return result as User;
  }

  async reject(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
    }
    user.status = UserStatus.REJECTED;
    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;
    return result as User;
  }
}