// Arquivo: src/users/users.service.ts

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ApproveUserDto } from './dto/approve-user.dto'; // Importe o novo DTO
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { UserStatus } from 'src/users/enums/users-status.enum'; // <-- ESTA É A LINHA DA CORREÇÃO

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

  // O método que você adicionou, agora com a dependência resolvida.
  async findPending(): Promise<User[]> {
    return this.usersRepository.find({
      where: {
        status: UserStatus.PENDING, 
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
  /**
 * Aprova um usuário, atualizando seu status e role.
 * @param id O ID do usuário a ser aprovado.
 * @param approveUserDto O DTO contendo a nova role.
 * @returns O usuário atualizado.
 */
async approve(id: string, approveUserDto: ApproveUserDto): Promise<User> {
  // 1. Encontra o usuário pelo ID. Se não encontrar, lança um erro.
  const user = await this.usersRepository.findOneBy({ id });
  if (!user) {
    throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
  }

  // 2. Atualiza os campos do usuário.
  user.status = UserStatus.ACTIVE;
  user.role = approveUserDto.role;

  // 3. Salva o usuário atualizado no banco.
  const savedUser = await this.usersRepository.save(user);
  
  // 4. Retorna o usuário sem a senha.
  const { password, ...result } = savedUser;
  return result as User;
}
/**
 * Rejeita um usuário, atualizando seu status para REJECTED.
 * @param id O ID do usuário a ser rejeitado.
 * @returns O usuário atualizado.
 */
async reject(id: string): Promise<User> {
  // 1. Encontra o usuário pelo ID.
  const user = await this.usersRepository.findOneBy({ id });
  if (!user) {
    throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
  }

  // 2. Atualiza apenas o status.
  user.status = UserStatus.REJECTED;

  // 3. Salva e retorna o usuário atualizado (sem a senha).
  const savedUser = await this.usersRepository.save(user);
  const { password, ...result } = savedUser;
  return result as User;
}
}