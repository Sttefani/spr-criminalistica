/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/users-role.enum';
import { OccurrenceMovementsService } from './occurrence-movements.service';
import { CreateOccurrenceMovementDto } from './dto/create-occurrence-movement.dto';

@Controller('occurrence-movements')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OccurrenceMovementsController {
  constructor(private readonly movementsService: OccurrenceMovementsService) {}

  // CRIAR MOVIMENTAÇÃO
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL)
  async createMovement(
    @Body() createDto: CreateOccurrenceMovementDto,
    @Req() req: any
  ) {
    return this.movementsService.createMovement(createDto, req.user);
  }

  // BUSCAR MOVIMENTAÇÕES DE UMA OCORRÊNCIA
  @Get('occurrence/:occurrenceId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL)
  async getOccurrenceMovements(
    @Param('occurrenceId') occurrenceId: string,
    @Req() req: any
  ) {
    return this.movementsService.getOccurrenceMovements(occurrenceId, req.user);
  }

  // LISTAR OCORRÊNCIAS COM STATUS DE PRAZO (para a tela principal)
  @Get('deadline-status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL)
  async getOccurrencesWithDeadlineStatus(@Req() req: any) {
    return this.movementsService.getOccurrencesWithDeadlineStatus(req.user);
  }

  // PRORROGAR PRAZO
  @Post('extend-deadline/:occurrenceId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL)
  async extendDeadline(
    @Param('occurrenceId') occurrenceId: string,
    @Body() body: { extensionDays: number; justification: string },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Req() req: any
  ) {
    return this.movementsService.extendDeadline(
      occurrenceId, 
      body.extensionDays, 
      body.justification, 
      req.user
    );
  }

  // BUSCAR MOVIMENTAÇÃO ESPECÍFICA
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL)
  async findOne(
    @Param('id') id: string,
    @Req() req: any
  ) {
    // Implementar se necessário
    return { message: 'Endpoint para busca específica' };
  }

  // ATUALIZAR FLAGS DE PRAZO (endpoint administrativo)
  @Post('update-deadline-flags')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  async updateDeadlineFlags() {
    await this.movementsService.updateAllDeadlineFlags();
    return { message: 'Flags de prazo atualizadas com sucesso' };
  }
  @Delete(':id')
   @Roles(UserRole.SUPER_ADMIN)
async softDeleteMovement(
  @Param('id') id: string,
  @Req() req: any
) {
  await this.movementsService.softDeleteMovement(id, req.user);
  return { message: 'Movimentação excluída com sucesso' };
}
}