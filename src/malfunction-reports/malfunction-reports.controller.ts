// Arquivo: src/malfunction-reports/malfunction-reports.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MalfunctionReportsService } from './malfunction-reports.service';
import { CreateMalfunctionReportDto } from './dto/create-malfunction-report.dto';
import { UpdateMalfunctionReportDto } from './dto/update-malfunction-report.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';

// Perfis internos que podem interagir com o módulo de frota
const INTERNAL_USERS = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
  UserRole.PERITO_OFICIAL,
  UserRole.DELEGADO,
  UserRole.OFICIAL_INVESTIGADOR,
];

// Perfis que podem gerenciar (atualizar) os registros de pane
const ALLOWED_ROLES_TO_MANAGE = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
];

@Controller('malfunction-reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MalfunctionReportsController {
  constructor(private readonly reportsService: MalfunctionReportsService) {}

  /**
   * Cria um novo registro de pane.
   * Acesso: Qualquer usuário interno
   */
  @Post()
  @Roles(...INTERNAL_USERS)
  create(@Body() createMalfunctionReportDto: CreateMalfunctionReportDto, @Req() req: any) {
    const reportingUser: User = req.user;
    return this.reportsService.create(createMalfunctionReportDto, reportingUser);
  }

  /**
   * Lista todos os registros de pane de uma viatura específica.
   * Acesso: Qualquer usuário interno
   */
  @Get('by-vehicle/:vehicleId')
  @Roles(...INTERNAL_USERS)
  findAllByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.reportsService.findAllByVehicle(vehicleId);
  }

  /**
   * Busca um registro de pane pelo seu ID.
   * Acesso: Qualquer usuário interno
   */
  @Get(':id')
  @Roles(...INTERNAL_USERS)
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  /**
   * Atualiza um registro de pane (muda status, vincula manutenção).
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO
   */
  @Patch(':id')
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  update(@Param('id') id: string, @Body() updateMalfunctionReportDto: UpdateMalfunctionReportDto) {
    return this.reportsService.update(id, updateMalfunctionReportDto);
  }

  /**
   * Deleta um registro de pane.
   * Acesso: APENAS SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}