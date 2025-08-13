// Arquivo: src/genetic-comparison-details/genetic-comparison-details.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { GeneticComparisonDetailsService } from './genetic-comparison-details.service';
import { CreateGeneticComparisonDetailDto } from './dto/create-genetic-comparison-detail.dto';
import { UpdateGeneticComparisonDetailDto } from './dto/update-genetic-comparison-detail.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';

// Perfis que podem criar ou editar os detalhes de uma ocorrência
const ALLOWED_ROLES_TO_MANAGE = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
  UserRole.PERITO_OFICIAL,
];

@Controller('genetic-comparison-details')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GeneticComparisonDetailsController {
  constructor(private readonly detailsService: GeneticComparisonDetailsService) {}

  @Post()
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  create(@Body() createDto: CreateGeneticComparisonDetailDto, @Req() req: any) {
    const currentUser: User = req.user;
    return this.detailsService.create(createDto, currentUser);
  }

  /**
   * Busca os detalhes de uma ocorrência específica.
   * A permissão de visualização (todos do LGF, admins) é complexa e será
   * tratada dentro do serviço de ocorrências gerais no futuro.
   * Por enquanto, qualquer usuário logado pode chamar, e o serviço de ocorrências
   * fará a validação de permissão no PAI.
   */
  @Get('by-occurrence/:occurrenceId')
  findByOccurrenceId(@Param('occurrenceId') occurrenceId: string) {
    // Este método no serviço precisa ser criado
    // return this.detailsService.findByOccurrenceId(occurrenceId);
    // Por enquanto, vamos retornar uma mensagem.
    return 'Endpoint para buscar detalhes de comparação genética por ocorrência a ser implementado.';
  }

  @Patch(':id')
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  update(@Param('id') id: string, @Body() updateDto: UpdateGeneticComparisonDetailDto, @Req() req: any) {
    const currentUser: User = req.user;
    return this.detailsService.update(id, updateDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    const currentUser: User = req.user;
    return this.detailsService.remove(id, currentUser);
  }
}