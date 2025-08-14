// Arquivo: src/general-occurrences/general-occurrences.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { GeneralOccurrencesService } from './general-occurrences.service';
import { CreateGeneralOccurrenceDto } from './dto/create-general-occurrence.dto';
import { UpdateGeneralOccurrenceDto } from './dto/update-general-occurrence.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards'; // CORRIGIDO
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';

// Perfis que podem criar ou iniciar a edição de uma ocorrência
const ALLOWED_ROLES_TO_MANAGE = [
  UserRole.SERVIDOR_ADMINISTRATIVO,
  UserRole.PERITO_OFICIAL,
  UserRole.SUPER_ADMIN,
];

@Controller('general-occurrences')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GeneralOccurrencesController {
  constructor(
    private readonly occurrencesService: GeneralOccurrencesService,
  ) {}

  /**
   * Cria uma nova Ocorrência Geral.
   */
  @Post()
  @Roles(UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL)
  create(@Body() createDto: CreateGeneralOccurrenceDto, @Req() req: any) {
    const creatingUser: User = req.user;
    return this.occurrencesService.create(createDto, creatingUser);
  }

  /**
   * Lista as ocorrências com base no perfil do usuário logado (para os dashboards).
   */
  @Get()
  findAll(@Req() req: any) {
    const currentUser: User = req.user;
    return this.occurrencesService.findAll(currentUser);
  }

  /**
   * Busca uma ocorrência específica pelo ID, respeitando as permissões de visualização.
   */
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const currentUser: User = req.user;
    return this.occurrencesService.findOne(id, currentUser);
  }

  /**
   * Atualiza uma ocorrência, respeitando as regras de propriedade e travamento.
   */
  @Patch(':id')
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateGeneralOccurrenceDto,
    @Req() req: any,
  ) {
    const currentUser: User = req.user;
    return this.occurrencesService.update(id, updateDto, currentUser);
  }

  /**
   * Deleta (soft delete) uma ocorrência. Apenas Super Admin.
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    const currentUser: User = req.user;
    return this.occurrencesService.remove(id, currentUser);
  }
}