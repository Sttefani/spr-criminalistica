// Arquivo: src/requesting-units/requesting-units.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RequestingUnitsService } from './requesting-units.service';
import { CreateRequestingUnitDto } from './dto/create-requesting-unit.dto';
import { UpdateRequestingUnitDto } from './dto/update-requesting-unit.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('requesting-units')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protege TODAS as rotas deste controller
export class RequestingUnitsController {
  constructor(private readonly requestingUnitsService: RequestingUnitsService) {}

  /**
   * Endpoint para criar uma nova Unidade Demandante.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  create(@Body() createRequestingUnitDto: CreateRequestingUnitDto) {
    return this.requestingUnitsService.create(createRequestingUnitDto);
  }

  /**
   * Endpoint para listar todas as Unidades Demandantes.
   * Acesso: Qualquer usuário logado
   */
  @Get()
  findAll() {
    return this.requestingUnitsService.findAll();
  }

  /**
   * Endpoint para buscar uma Unidade Demandante específica.
   * Acesso: Qualquer usuário logado
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestingUnitsService.findOne(id);
  }

  /**
   * Endpoint para atualizar uma Unidade Demandante.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  update(@Param('id') id: string, @Body() updateRequestingUnitDto: UpdateRequestingUnitDto) {
    return this.requestingUnitsService.update(id, updateRequestingUnitDto);
  }

  /**
   * Endpoint para deletar uma Unidade Demandante.
   * Acesso: APENAS SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    // Retornamos um status 204 No Content, que é o padrão para delete bem-sucedido
    // Para isso, o método no controller não precisa retornar nada.
    return this.requestingUnitsService.remove(id);
  }
}