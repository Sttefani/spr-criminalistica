/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ExamTypesService } from './exam-types.service';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('exam-types')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ExamTypesController {
  constructor(private readonly examTypesService: ExamTypesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL)
  create(@Body() createExamTypeDto: CreateExamTypeDto) {
    return this.examTypesService.create(createExamTypeDto);
  }

  // ==========================================================
  // MÉTODO findAll CORRIGIDO PARA PAGINAÇÃO
  // Acesso permitido para qualquer usuário logado (sem @Roles)
  // ==========================================================
  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.examTypesService.findAll(pageNumber, limitNumber, search);
  }

  // Acesso permitido para qualquer usuário logado (sem @Roles)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examTypesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL)
  update(@Param('id') id: string, @Body() updateExamTypeDto: UpdateExamTypeDto) {
    return this.examTypesService.update(id, updateExamTypeDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.examTypesService.remove(id);
  }
}