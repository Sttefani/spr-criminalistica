// Arquivo: src/procedures/procedures.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProceduresService } from './procedures.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('procedures')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protege TODAS as rotas com login e verificação de roles
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  /**
   * Cria um novo procedimento.
   * Acesso: Apenas SUPER_ADMIN
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() createProcedureDto: CreateProcedureDto) {
    // Lembre-se de remover o '+' do id que o NestJS gera por padrão
    return this.proceduresService.create(createProcedureDto);
  }

  /**
   * Lista todos os procedimentos.
   * Acesso: Qualquer usuário logado
   */
  @Get()
  findAll() {
    return this.proceduresService.findAll();
  }

  /**
   * Busca um procedimento pelo ID.
   * Acesso: Qualquer usuário logado
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proceduresService.findOne(id);
  }

  /**
   * Atualiza um procedimento.
   * Acesso: Apenas SUPER_ADMIN
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateProcedureDto: UpdateProcedureDto) {
    return this.proceduresService.update(id, updateProcedureDto);
  }

  /**
   * Deleta (soft delete) um procedimento.
   * Acesso: Apenas SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.proceduresService.remove(id);
  }
}