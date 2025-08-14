// Arquivo: src/patrimony-classifications/patrimony-categories.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PatrimonyCategoriesService } from './patrimony-categories.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { CreatePatrimonyCategoryDto } from '../dto/create-patrimony-category.dto';
import { UpdatePatrimonyCategoryDto } from '../dto/update-patrimony-category.dto';

@Controller('patrimony-categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PatrimonyCategoriesController {
  constructor(private readonly categoriesService: PatrimonyCategoriesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  create(@Body() createDto: CreatePatrimonyCategoryDto) {
    return this.categoriesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  update(@Param('id') id: string, @Body() updateDto: UpdatePatrimonyCategoryDto) {
    return this.categoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}