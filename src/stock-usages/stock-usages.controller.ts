// Arquivo: src/stock-usages/stock-usages.controller.ts

import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { StockUsagesService } from './stock-usages.service';
import { CreateStockUsageDto } from './dto/create-stock-usage.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';

const INTERNAL_USERS = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
  UserRole.PERITO_OFICIAL,
];

const ALLOWED_ROLES_TO_REGISTER = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
  UserRole.PERITO_OFICIAL,
];

const ALLOWED_ROLES_TO_DELETE = [
  UserRole.SUPER_ADMIN,
];

@Controller('stock-usages')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StockUsagesController {
  constructor(private readonly usagesService: StockUsagesService) {}

  /**
   * Registra uma nova saída/uso de item do estoque.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO, PERITO_OFICIAL
   */
  @Post()
  @Roles(...ALLOWED_ROLES_TO_REGISTER)
  create(@Body() createStockUsageDto: CreateStockUsageDto, @Req() req: any) {
    const creatingUser: User = req.user;
    return this.usagesService.create(createStockUsageDto, creatingUser);
  }

  /**
   * Lista todas as saídas de um item de estoque específico.
   * Acesso: Qualquer usuário interno
   */
  @Get('by-item/:stockItemId')
  @Roles(...INTERNAL_USERS)
  findAllByItem(@Param('stockItemId') stockItemId: string) {
    return this.usagesService.findAllByItem(stockItemId);
  }

  /**
   * Deleta (estorna) um registro de uso de estoque.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO
   */
  @Delete(':id')
  @Roles(...ALLOWED_ROLES_TO_DELETE)
  remove(@Param('id') id: string) {
    return this.usagesService.remove(id);
  }
}