// Arquivo: src/exam-types/exam-types.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExamTypesService } from './exam-types.service';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('exam-types')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protege TODAS as rotas com login e verificação de roles
export class ExamTypesController {
  constructor(private readonly examTypesService: ExamTypesService) {}

  /**
   * Cria um novo tipo de exame.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  create(@Body() createExamTypeDto: CreateExamTypeDto) {
    // O CLI pode ter gerado um '+id', já removi para consistência com o Service
    return this.examTypesService.create(createExamTypeDto);
  }

  /**
   * Lista todos os tipos de exame.
   * Acesso: Qualquer usuário logado
   */
  @Get()
  findAll() {
    return this.examTypesService.findAll();
  }

  /**
   * Busca um tipo de exame pelo ID.
   * Acesso: Qualquer usuário logado
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examTypesService.findOne(id);
  }

  /**
   * Atualiza um tipo de exame.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  update(@Param('id') id: string, @Body() updateExamTypeDto: UpdateExamTypeDto) {
    return this.examTypesService.update(id, updateExamTypeDto);
  }

  /**
   * Deleta (soft delete) um tipo de exame.
   * Acesso: APENAS SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.examTypesService.remove(id);
  }
}