// Arquivo: src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service'; // Precisamos do serviço de usuários para buscar um usuário no banco
import { JwtService } from '@nestjs/jwt'; // Ferramenta do Nest para criar o token JWT
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // Pedimos ao NestJS para nos dar o UsersService e o JwtService
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida se um usuário existe e se a senha está correta.
   * @param email O e-mail do usuário
   * @param pass A senha que o usuário digitou no login
   * @returns O objeto do usuário se a validação for bem-sucedida, caso contrário null.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    // 1. Buscamos o usuário no banco de dados pelo e-mail
    const user = await this.usersService.findOneByEmail(email);

    // 2. Se o usuário existir, comparamos a senha digitada com a senha criptografada no banco
    if (user && (await bcrypt.compare(pass, user.password))) {
      // 3. Se as senhas baterem, removemos a senha do objeto e retornamos o usuário
      const { password, ...result } = user;
      return result;
    }

    // 4. Se o usuário não existir ou a senha estiver incorreta, retornamos null.
    return null;
  }

  /**
   * Lida com o fluxo de login.
   * @param user O objeto do usuário que já foi validado pelo método `validateUser`.
   * @returns Um objeto contendo o token de acesso.
   */
  async login(user: any) {
    // O 'payload' são as informações que queremos armazenar dentro do token.
    // NUNCA coloque informações sensíveis como a senha aqui.
    const payload = {
      sub: user.id, // 'sub' (subject) é o padrão para o ID do usuário no JWT
      name: user.name,
      role: user.role,
    };

    // Usamos o jwtService para "assinar" o payload, criando o token.
    // Ele usa a chave secreta que definimos no arquivo .env
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}