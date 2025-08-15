// Arquivo: src/stock-items/stock-items.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StockItemsService } from './stock-items.service';
import { CreateStockItemDto } from './dto/create-stock-item.dto';
import { UpdateStockItemDto } from './dto/update-stock-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

const INTERNAL_USERS = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
  UserRole.PERITO_OFICIAL,
];

const ALLOWED_ROLES_TO_MANAGE = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
];

@Controller('stock-items')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StockItemsController {
  constructor(private readonly itemsService: StockItemsService) {}

  /**
   * Cria um novo item no catálogo de estoque.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO
   */
  @Post()
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  create(@Body() createStockItemDto: CreateStockItemDto) {
    return this.itemsService.create(createStockItemDto);
  }

  /**
   * Lista todos os itens do catálogo de estoque.
   * Acesso: Qualquer usuário interno
   */
  @Get()
  @Roles(...INTERNAL_USERS)
  findAll() {
    return this.itemsService.findAll();
  }

  /**
   * Busca um item do catálogo pelo ID.
   * Acesso: Qualquer usuário interno
   */
  @Get(':id')
  @Roles(...INTERNAL_USERS)
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  /**
   * Atualiza um item do catálogo de estoque.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO
   */
  @Patch(':id')
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  update(@Param('id') id: string, @Body() updateStockItemDto: UpdateStockItemDto) {
    return this.itemsService.update(id, updateStockItemDto);
  }

  /**
   * Deleta (soft delete) um item do catálogo.
   * Acesso: APENAS SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}