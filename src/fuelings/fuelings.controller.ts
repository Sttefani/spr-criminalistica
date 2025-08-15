// Arquivo: src/fuelings/fuelings.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { FuelingsService } from './fuelings.service';
import { CreateFuelingDto } from './dto/create-fueling.dto';
import { UpdateFuelingDto } from './dto/update-fueling.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';

@Controller('fuelings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FuelingsController {
  constructor(private readonly fuelingsService: FuelingsService) {}

  /**
   * Registra um novo abastecimento.
   * Acesso: Qualquer usuário logado
   */
  @Post()
  create(@Body() createFuelingDto: CreateFuelingDto, @Req() req: any) {
    const creatingUser: User = req.user;
    return this.fuelingsService.create(createFuelingDto, creatingUser);
  }

  /**
   * Lista todos os abastecimentos de uma viatura específica.
   * Acesso: Qualquer usuário logado
   */
  @Get('by-vehicle/:vehicleId')
  findAllByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.fuelingsService.findAllByVehicle(vehicleId);
  }

  /**
   * Busca um registro de abastecimento pelo seu ID.
   * Acesso: Qualquer usuário logado
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fuelingsService.findOne(id);
  }

  /**
   * Atualiza um registro de abastecimento.
   * Acesso: Qualquer usuário (se for o último registro) ou SUPER_ADMIN.
   * A lógica de permissão está no serviço.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFuelingDto: UpdateFuelingDto, @Req() req: any) {
    const currentUser: User = req.user;
    return this.fuelingsService.update(id, updateFuelingDto, currentUser);
  }

  /**
   * Deleta (soft delete) um registro de abastecimento.
   * Acesso: APENAS SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.fuelingsService.remove(id);
  }
}