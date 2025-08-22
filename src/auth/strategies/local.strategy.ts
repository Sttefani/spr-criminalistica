/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    // ==========================================================
    // CHECKPOINT 1: O LOGIN CHEGOU AQUI?
    // ==========================================================
    console.log(`--- CHECKPOINT 1 [LocalStrategy] ---`);
    console.log(`Recebido para validação -> Email: ${email}, Senha: ${password}`);

    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      console.log(`--- CHECKPOINT 1.1 [LocalStrategy] --- validateUser falhou. Lançando erro.`);
      throw new UnauthorizedException('Credenciais inválidas (retorno da strategy).');
    }
    
    console.log(`--- CHECKPOINT 1.2 [LocalStrategy] --- validateUser SUCESSO. Retornando usuário.`);
    return user;
  }
}