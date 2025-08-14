// Arquivo: src/patrimony-classifications/patrimony-subcategories.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PatrimonySubcategoriesService } from './patrimony-subcategories.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { CreatePatrimonySubcategoryDto } from '../dto/create-patrimony-subcategory.dto';
import { UpdatePatrimonySubcategoryDto } from '../dto/update-patrimony-subcategory.dto';

@Controller('patrimony-subcategories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PatrimonySubcategoriesController {
  constructor(private readonly subcategoriesService: PatrimonySubcategoriesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  create(@Body() createDto: CreatePatrimonySubcategoryDto) {
    return this.subcategoriesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.subcategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  update(@Param('id') id: string, @Body() updateDto: UpdatePatrimonySubcategoryDto) {
    return this.subcategoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(id);
  }
}