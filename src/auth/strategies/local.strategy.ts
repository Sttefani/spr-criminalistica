import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Por padrão, a LocalStrategy espera 'username' e 'password'.
    // Estamos dizendo a ela para usar o campo 'email' em vez de 'username'.
    super({ usernameField: 'email' });
  }

  /**
   * Este método será chamado automaticamente pelo Passport quando usarmos o AuthGuard('local').
   * Ele recebe o email e a senha que o usuário enviou.
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return user;
  }
}