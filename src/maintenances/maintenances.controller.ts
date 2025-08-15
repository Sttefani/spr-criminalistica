// Arquivo: src/maintenances/maintenances.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MaintenancesService } from './maintenances.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('maintenances')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) {}

  /**
   * Cria um novo registro de manutenção.
   * Acesso: APENAS SERVIDOR_ADMINISTRATIVO
   */
  @Post()
  @Roles(UserRole.SERVIDOR_ADMINISTRATIVO)
  create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenancesService.create(createMaintenanceDto);
  }

  /**
   * Lista todas as manutenções de uma viatura específica.
   * Acesso: Qualquer usuário logado
   */
  @Get('by-vehicle/:vehicleId')
  findAllByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.maintenancesService.findAllByVehicle(vehicleId);
  }

  /**
   * Busca um registro de manutenção pelo seu ID.
   * Acesso: Qualquer usuário logado
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenancesService.findOne(id);
  }

  /**
   * Atualiza um registro de manutenção.
   * Acesso: APENAS SUPER_ADMIN
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO) // <-- CORRIGIDO
  update(@Param('id') id: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto) {
    return this.maintenancesService.update(id, updateMaintenanceDto);
  }

  /**
   * Deleta (soft delete) um registro de manutenção.
   * Acesso: APENAS SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.maintenancesService.remove(id);
  }
}