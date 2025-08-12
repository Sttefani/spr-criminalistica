// Arquivo: src/definitive-drug-tests/definitive-drug-tests.controller.ts

import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param, Delete } from '@nestjs/common';
import { DefinitiveDrugTestsService } from './definitive-drug-tests.service';
import { CreateDefinitiveDrugTestDto } from './dto/create-definitive-drug-test.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';
import { UpdateDefinitiveDrugTestDto } from './dto/update-definitive-drug-test.dto';

// Vamos definir quem pode criar este tipo de registro.
// Apenas o PERITO_OFICIAL (que trabalha no laboratório) pode.
// Poderíamos criar uma role mais específica como PERITO_QUIMICO no futuro.
const ALLOWED_ROLES_TO_CREATE = [
  UserRole.PERITO_OFICIAL,
];

@Controller('definitive-drug-tests')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DefinitiveDrugTestsController {
  constructor(
    private readonly definitiveService: DefinitiveDrugTestsService,
  ) {}

   @Get()
  findAll() {
    return this.definitiveService.findAll();
  }

  @Post()
  @Roles(...ALLOWED_ROLES_TO_CREATE)
  create(
    @Body() createDto: CreateDefinitiveDrugTestDto,
    @Req() req: any,
  ) {
    // Pegamos o usuário que está logado (o perito do laboratório)
    const creatingUser: User = req.user;
    return this.definitiveService.create(createDto, creatingUser);
  }

  @Patch(':id')
  @Roles(...ALLOWED_ROLES_TO_CREATE, UserRole.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDefinitiveDrugTestDto,
    @Req() req: any,
  ) {
    const currentUser: User = req.user;
    return this.definitiveService.update(id, updateDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.definitiveService.remove(id);
  }

}