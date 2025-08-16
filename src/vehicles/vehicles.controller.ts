// Arquivo: src/vehicles/vehicles.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';

// Perfis que podem criar e editar viaturas
const ALLOWED_ROLES_TO_MANAGE = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
  UserRole.PERITO_OFICIAL,
];

@Controller('vehicles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  /**
   * Cria uma nova viatura.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO, PERITO_OFICIAL
   */
  @Post()
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  /**
   * Lista todas as viaturas.
   * Acesso: Qualquer usuário logado
   */
  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get('search')
  findByPlate(@Query('plate') plate?: string) {
    return this.vehiclesService.findByPlate(plate);
  }
  /**
   * Busca uma viatura pelo ID.
   * Acesso: Qualquer usuário logado
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  /**
   * Atualiza uma viatura.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO, PERITO_OFICIAL
   */
  @Patch(':id')
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  /**
   * Deleta (soft delete) uma viatura.
   * Acesso: APENAS SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    const currentUser: User = req.user;
    return this.vehiclesService.remove(id, currentUser);
  }
}
