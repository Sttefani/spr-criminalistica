// Arquivo: src/auth/auth.controller.ts

import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Rota de Login.
   * @UseGuards(AuthGuard('local')) -> Este é o "porteiro" da nossa rota.
   * Ele intercepta a requisição e automaticamente usa nossa LocalStrategy
   * para validar o email e a senha do corpo da requisição.
   * Se a validação for bem-sucedida, o objeto do usuário é anexado ao `request`.
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    // Se a requisição chegou até aqui, significa que a LocalStrategy validou o usuário.
    // O objeto 'user' está disponível em req.user.
    // Agora, passamos esse usuário para o método login do nosso serviço para gerar o token.
    return this.authService.login(req.user);
  }
}