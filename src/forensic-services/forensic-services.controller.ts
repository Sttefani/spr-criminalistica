/* eslint-disable prettier/prettier */
// Arquivo: src/forensic-services/forensic-services.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ForensicServicesService } from './forensic-services.service';
import { CreateForensicServiceDto } from './dto/create-forensic-service.dto';
import { UpdateForensicServiceDto } from './dto/update-forensic-service.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('forensic-services')
// NOTA: Mantenha o UseGuards aqui. Ele garante autenticação JWT e que o RolesGuard será aplicado.
// A permissão específica será definida com @Roles nos métodos.
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ForensicServicesController {
  constructor(private readonly servicesService: ForensicServicesService) {}

  /**
   * Cria um novo serviço pericial.
   * Acesso: Apenas SUPER_ADMIN e SERVIDOR_ADMINISTRATIVO
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  create(@Body() createDto: CreateForensicServiceDto) {
    return this.servicesService.create(createDto);
  }

  /**
   * Lista todos os serviços periciais com paginação e busca.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO, PERITO_OFICIAL (e talvez outros que precisam ver a lista)
   */
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL) // <-- ADICIONE AQUI!
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;
    
    if (page || limit || search) { // Você já tem uma lógica para determinar se é paginado
      return this.servicesService.findAllPaginated(parsedPage, parsedLimit, search);
    }
    
    return this.servicesService.findAll(); // Método sem paginação
  }

  /**
   * NOVO ENDPOINT: Lista simples sem paginação (para dropdowns)
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO, PERITO_OFICIAL (para consumo em dropdowns)
   */
  @Get('simple')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL) // <-- ADICIONE AQUI TAMBÉM!
  findAllSimple() {
    return this.servicesService.findAll();
  }

  /**
   * Busca um serviço pericial pelo ID.
   * Acesso: SUPER_ADMIN, SERVIDOR_ADMINISTRATIVO, PERITO_OFICIAL (e talvez outros)
   */
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL) // <-- E AQUI!
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  /**
   * Atualiza um serviço pericial.
   * Acesso: Apenas SUPER_ADMIN e SERVIDOR_ADMINISTRATIVO
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
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