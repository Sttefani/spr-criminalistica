/* eslint-disable prettier/prettier */
// Arquivo: src/authorities/authorities.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthoritiesService } from './authorities.service';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('authorities')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protege TODAS as rotas com login e verificação de roles
export class AuthoritiesController {
  constructor(private readonly authoritiesService: AuthoritiesService) {}

  /**
   * Cria uma nova autoridade.
   * Acesso: Apenas SUPER_ADMIN
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO) // <-- CORRIGIDO
  create(@Body() createAuthorityDto: CreateAuthorityDto) {
    return this.authoritiesService.create(createAuthorityDto);
  }

  /**
   * Lista todas as autoridades.
   * Acesso: Qualquer usuário logado
   */
  @Get()
  findAll() {
    return this.authoritiesService.findAll();
  }

  /**
   * Busca uma autoridade pelo ID.
   * Acesso: Qualquer usuário logado
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authoritiesService.findOne(id);
  }

  /**
   * Atualiza uma autoridade.
   * Acesso: Apenas SUPER_ADMIN
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO) // <-- CORRIGIDO
  update(@Param('id') id: string, @Body() updateAuthorityDto: UpdateAuthorityDto) {
    return this.authoritiesService.update(id, updateAuthorityDto);
  }
  /**
   * Deleta (soft delete) uma autoridade.
   * Acesso: Apenas SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.authoritiesService.remove(id);
  }
}