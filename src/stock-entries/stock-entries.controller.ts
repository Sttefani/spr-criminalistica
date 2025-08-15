// Arquivo: src/stock-entries/stock-entries.controller.ts

import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { StockEntriesService } from './stock-entries.service';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';

const INTERNAL_USERS = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
];

const ALLOWED_ROLES_TO_CREATE = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
];

@Controller('stock-entries')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StockEntriesController {
  constructor(private readonly entriesService: StockEntriesService) {}

  /**
   * Registra uma nova entrada de item no estoque.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO
   */
  @Post()
  @Roles(...ALLOWED_ROLES_TO_CREATE)
  create(@Body() createStockEntryDto: CreateStockEntryDto, @Req() req: any) {
    const creatingUser: User = req.user;
    return this.entriesService.create(createStockEntryDto, creatingUser);
  }

  /**
   * Lista todas as entradas de um item de estoque específico.
   * Acesso: Qualquer usuário interno
   */
  @Get('by-item/:stockItemId')
  @Roles(...INTERNAL_USERS)
  findAllByItem(@Param('stockItemId') stockItemId: string) {
    return this.entriesService.findAllByItem(stockItemId);
  }

  /**
   * Deleta um registro de entrada de estoque.
   * Acesso: APENAS SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.entriesService.remove(id);
  }
}