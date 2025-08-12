// Arquivo: src/cities/cities.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('cities')
// Aplicando o guard de JWT em todas as rotas deste controller de uma vez.
// Qualquer endpoint aqui dentro exigirá que o usuário esteja logado.
@UseGuards(AuthGuard('jwt'), RolesGuard) 
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  /**
   * Endpoint para criar uma nova cidade.
   * Acesso permitido para SUPER_ADMIN e SERVIDOR_ADMINISTRATIVO.
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  /**
   * Endpoint para listar todas as cidades.
   * Acesso permitido para qualquer usuário logado.
   */
  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  /**
   * Endpoint para buscar uma cidade específica pelo ID.
   * Acesso permitido para qualquer usuário logado.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }

  /**
   * Endpoint para atualizar uma cidade.
   * Acesso permitido para SUPER_ADMIN e SERVIDOR_ADMINISTRATIVO.
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(id, updateCityDto);
  }

  /**
   * Endpoint para deletar (soft delete) uma cidade.
   * Acesso permitido APENAS para SUPER_ADMIN.
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.citiesService.remove(id);
  }
}