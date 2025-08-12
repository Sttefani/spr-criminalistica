// Arquivo: src/general-occurrences/general-occurrences.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { GeneralOccurrencesService } from './general-occurrences.service';
import { CreateGeneralOccurrenceDto } from './dto/create-general-occurrence.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';
import { UpdateGeneralOccurrenceDto } from './dto/update-general-occurrence.dto';
// Perfis que podem criar uma nova ocorrência geral

const ALLOWED_ROLES_TO_CREATE = [
  UserRole.SERVIDOR_ADMINISTRATIVO,
  UserRole.PERITO_OFICIAL,
];

Controller('general-occurrences')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GeneralOccurrencesController {
  constructor(private readonly occurrencesService: GeneralOccurrencesService) {}

  @Post()
  @Roles(...ALLOWED_ROLES_TO_CREATE)
  create(@Body() createDto: CreateGeneralOccurrenceDto, @Req() req: any) {
    const creatingUser: User = req.user;
    return this.occurrencesService.create(createDto, creatingUser);
  }

  @Get()
  findAll(@Req() req: any) {
    const currentUser: User = req.user;
    return this.occurrencesService.findAll(currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const currentUser: User = req.user;
    return this.occurrencesService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(...ALLOWED_ROLES_TO_CREATE, UserRole.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateDto: UpdateGeneralOccurrenceDto, @Req() req: any) {
    const currentUser: User = req.user;
    return this.occurrencesService.update(id, updateDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    const currentUser: User = req.user;
    return this.occurrencesService.remove(id, currentUser);
  }
}