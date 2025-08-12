// Arquivo: src/forensic-services/forensic-services.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ForensicServicesService } from './forensic-services.service';
import { CreateForensicServiceDto } from './dto/create-forensic-service.dto';
import { UpdateForensicServiceDto } from './dto/update-forensic-service.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('forensic-services')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protege TODAS as rotas com login e verificação de roles
export class ForensicServicesController {
  constructor(private readonly servicesService: ForensicServicesService) {}

  /**
   * Cria um novo serviço pericial.
   * Acesso: Apenas SUPER_ADMIN
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() createDto: CreateForensicServiceDto) {
    // Lembre-se de remover o '+' do id que o NestJS gera por padrão
    return this.servicesService.create(createDto);
  }

  /**
   * Lista todos os serviços periciais.
   * Acesso: Qualquer usuário logado
   */
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  /**
   * Busca um serviço pericial pelo ID.
   * Acesso: Qualquer usuário logado
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  /**
   * Atualiza um serviço pericial.
   * Acesso: Apenas SUPER_ADMIN
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateForensicServiceDto) {
    return this.servicesService.update(id, updateDto);
  }

  /**
   * Deleta (soft delete) um serviço pericial.
   * Acesso: Apenas SUPER_ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}