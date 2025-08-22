/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../users/enums/users-status.enum';
import { User } from '../users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida as credenciais de um usuário usando seu e-mail e senha.
   * Retorna os dados do usuário se a validação for bem-sucedida.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    console.log('--- CHECKPOINT 2 [validateUser] ---');
    console.log('Buscando usuário com email:', email);
    
    // 1. Busca o usuário pelo e-mail
    const user = await this.usersService.findOneByEmail(email);
    console.log('--- CHECKPOINT 2.1 --- Usuário encontrado:', user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      hasPassword: !!user.password
    } : 'NÃO ENCONTRADO');

    if (user && user.password) {
      console.log('--- CHECKPOINT 2.2 --- Comparando senhas...');
      console.log('Senha fornecida:', pass);
      console.log('Hash no banco (primeiros 20 chars):', user.password.substring(0, 20) + '...');
      
      const passwordMatch = await bcrypt.compare(pass, user.password);
      console.log('--- CHECKPOINT 2.3 --- Senha confere:', passwordMatch);
      
      if (passwordMatch) {
        console.log('--- CHECKPOINT 2.4 --- Verificando status...');
        console.log('Status do usuário:', user.status);
        console.log('Status ACTIVE enum:', UserStatus.ACTIVE);
        console.log('Status confere:', user.status === UserStatus.ACTIVE);
        
        if (user.status !== UserStatus.ACTIVE) {
          console.log('--- CHECKPOINT 2.5 --- Status inválido, lançando erro');
          throw new UnauthorizedException(`Sua conta está com status "${user.status}".`);
        }
        
        console.log('--- CHECKPOINT 2.6 --- Tudo OK, retornando usuário');
        const { password, ...result } = user;
        return result;
      } else {
        console.log('--- CHECKPOINT 2.7 --- Senha incorreta');
      }
    } else {
      console.log('--- CHECKPOINT 2.8 --- Usuário não encontrado ou sem senha');
    }
    
    console.log('--- CHECKPOINT 2.9 --- Retornando null (falha na validação)');
    return null;
  }

  /**
   * Gera o token JWT para um usuário autenticado.
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async login(user: User) {
    console.log('--- LOGIN --- Gerando token para usuário:', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
   
    const token = this.jwtService.sign(payload);
    console.log('--- LOGIN --- Token gerado com sucesso');

    return {
      access_token: token,
    };
  }
}