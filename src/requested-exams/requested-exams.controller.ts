// Arquivo: src/requested-exams/requested-exams.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { RequestedExamsService } from './requested-exams.service';
import { CreateRequestedExamDto } from './dto/create-requested-exam.dto';
import { UpdateRequestedExamDto } from './dto/update-requested-exam.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';

const ALLOWED_ROLES_TO_CREATE = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
  UserRole.PERITO_OFICIAL,
];

@Controller('requested-exams')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RequestedExamsController {
  constructor(private readonly requestedExamsService: RequestedExamsService) {}

  @Post()
  @Roles(...ALLOWED_ROLES_TO_CREATE)
  create(@Body() createDto: CreateRequestedExamDto, @Req() req: any) {
    const creatingUser: User = req.user;
    return this.requestedExamsService.create(createDto, creatingUser);
  }

  /**
   * Lista os exames. Pode ser filtrado por occurrenceId.
   * Acesso: Qualquer usuário logado
   */
  @Get()
  findAll(@Query('occurrenceId') occurrenceId?: string) {
    // Se um occurrenceId for fornecido na URL (?occurrenceId=...), filtramos por ele.
    if (occurrenceId) {
      return this.requestedExamsService.findAllByOccurrence(occurrenceId);
    }
    return this.requestedExamsService.findAll();
  }

  /**
   * Busca um exame solicitado específico pelo seu ID.
   * Acesso: Qualquer usuário logado
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestedExamsService.findOne(id);
  }

  /**
   * Atualiza um exame solicitado (ex: status, perito).
   * Acesso: Apenas o perito designado ou admins.
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PERITO_OFICIAL)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRequestedExamDto,
    @Req() req: any,
  ) {
    const currentUser: User = req.user;
    return this.requestedExamsService.update(id, updateDto, currentUser);
  }

  /**
   * Remove uma solicitação de exame.
   * Acesso: Apenas SUPER_ADMIN e SERVIDOR_ADMINISTRATIVO
   */
    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN, UserRole.PERITO_OFICIAL)
    remove(@Param('id') id: string, @Req() req: any) {
    const currentUser: User = req.user;
    return this.requestedExamsService.remove(id, currentUser);
    }
}