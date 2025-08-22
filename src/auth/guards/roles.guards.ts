/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Arquivo: src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Pega as 'roles' necessárias que definimos com o @Roles() no controller.
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Se não há roles definidas na rota, permite o acesso (outros guards, como o JwtAuthGuard, ainda se aplicam).
    if (!requiredRoles) {
      return true;
    }

    // 3. Pega o objeto 'user' que foi anexado à requisição pelo JwtStrategy.
    const { user } = context.switchToHttp().getRequest();

    // 4. Verifica se a 'role' do usuário está na lista de 'roles' permitidas.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}