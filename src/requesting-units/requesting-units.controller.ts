/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RequestingUnitsService } from './requesting-units.service';
import { CreateRequestingUnitDto } from './dto/create-requesting-unit.dto';
import { UpdateRequestingUnitDto } from './dto/update-requesting-unit.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('requesting-units')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RequestingUnitsController {
  constructor(private readonly requestingUnitsService: RequestingUnitsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  create(@Body() createRequestingUnitDto: CreateRequestingUnitDto) {
    return this.requestingUnitsService.create(createRequestingUnitDto);
  }

  // MÉTODO CORRIGIDO PARA PAGINAÇÃO
  // Sem @Roles() para permitir que todos os usuários logados listem
  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.requestingUnitsService.findAll(pageNumber, limitNumber, search);
  }

  // Sem @Roles() para permitir que todos os usuários logados vejam
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestingUnitsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  update(@Param('id') id: string, @Body() updateRequestingUnitDto: UpdateRequestingUnitDto) {
    return this.requestingUnitsService.update(id, updateRequestingUnitDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.requestingUnitsService.remove(id);
  }
}