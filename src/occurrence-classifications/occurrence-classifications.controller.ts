/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OccurrenceClassificationsService } from './occurrence-classifications.service';
import { CreateOccurrenceClassificationDto } from './dto/create-occurrence-classification.dto';
import { UpdateOccurrenceClassificationDto } from './dto/update-occurrence-classification.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('occurrence-classifications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OccurrenceClassificationsController {
  constructor(private readonly classificationsService: OccurrenceClassificationsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  create(@Body() createDto: CreateOccurrenceClassificationDto) {
    return this.classificationsService.create(createDto);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
    @Query('group') group?:string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.classificationsService.findAll(pageNumber, limitNumber, search, group);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classificationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  update(@Param('id') id: string, @Body() updateDto: UpdateOccurrenceClassificationDto) {
    return this.classificationsService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    // Simplificado para confiar no RolesGuard
    return this.classificationsService.remove(id);
  }
  @Get('groups/all')
  findAllGroups() {
    return this.classificationsService.findAllGroups();
  }
}