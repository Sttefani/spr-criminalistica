// Arquivo: src/environmental-crime-details/environmental-crime-details.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EnvironmentalCrimeDetailsService } from './environmental-crime-details.service';
import { CreateEnvironmentalCrimeDetailDto } from './dto/create-environmental-crime-detail.dto';
import { UpdateEnvironmentalCrimeDetailDto } from './dto/update-environmental-crime-detail.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';

const ALLOWED_ROLES_TO_MANAGE = [
  UserRole.SUPER_ADMIN,
  UserRole.SERVIDOR_ADMINISTRATIVO,
  UserRole.PERITO_OFICIAL,
];

@Controller('environmental-crime-details')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EnvironmentalCrimeDetailsController {
  constructor(private readonly detailsService: EnvironmentalCrimeDetailsService) {}

  @Post()
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  create(@Body() createDto: CreateEnvironmentalCrimeDetailDto, @Req() req: any) {
    const currentUser: User = req.user;
    return this.detailsService.create(createDto, currentUser);
  }

  @Get('by-occurrence/:occurrenceId')
  findByOccurrenceId(@Param('occurrenceId') occurrenceId: string) {
    return this.detailsService.findByOccurrenceId(occurrenceId);
  }

  @Patch(':id')
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  update(@Param('id') id: string, @Body() updateDto: UpdateEnvironmentalCrimeDetailDto, @Req() req: any) {
    const currentUser: User = req.user;
    return this.detailsService.update(id, updateDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    const currentUser: User = req.user;
    return this.detailsService.remove(id, currentUser);
  }
}