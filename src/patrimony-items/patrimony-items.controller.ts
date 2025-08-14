// Arquivo: src/patrimony-items/patrimony-items.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PatrimonyItemsService } from './patrimony-items.service';
import { CreatePatrimonyItemDto } from './dto/create-patrimony-item.dto';
import { UpdatePatrimonyItemDto } from './dto/update-patrimony-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('patrimony-items')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PatrimonyItemsController {
  constructor(private readonly itemsService: PatrimonyItemsService) {}

  /**
   * Cria um novo item patrimonial.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  create(@Body() createPatrimonyItemDto: CreatePatrimonyItemDto) {
    return this.itemsService.create(createPatrimonyItemDto);
  }

  /**
   * Lista todos os itens patrimoniais.
   * Acesso: Qualquer usuário logado
   */
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  /**
   * Busca um item patrimonial pelo ID.
   * Acesso: Qualquer usuário logado
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  /**
   * Atualiza um item patrimonial.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  update(@Param('id') id: string, @Body() updatePatrimonyItemDto: UpdatePatrimonyItemDto) {
    return this.itemsService.update(id, updatePatrimonyItemDto);
  }

  /**
   * Deleta (soft delete) um item patrimonial.
   * Acesso: APENAS SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}