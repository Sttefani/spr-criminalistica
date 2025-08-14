// Arquivo: src/patrimony-movements/patrimony-movements.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PatrimonyMovementsService } from './patrimony-movements.service';
import { CreatePatrimonyMovementDto } from './dto/create-patrimony-movement.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';

@Controller('patrimony-movements')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PatrimonyMovementsController {
  constructor(private readonly movementsService: PatrimonyMovementsService) {}

  /**
   * Registra uma nova movimentação para um item patrimonial.
   * Acesso: SUPER_ADMIN e SERVIDOR_ADMINISTRATIVO
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  create(@Body() createDto: CreatePatrimonyMovementDto, @Req() req: any) {
    const responsibleAdmin: User = req.user;
    return this.movementsService.create(createDto, responsibleAdmin);
  }

  /**
   * Retorna o histórico ("extrato") de um item patrimonial específico.
   * Acesso: Qualquer usuário logado
   */
  @Get('history/:patrimonyItemId')
  findAllByItem(@Param('patrimonyItemId') patrimonyItemId: string) {
    return this.movementsService.findAllByItem(patrimonyItemId);
  }
}