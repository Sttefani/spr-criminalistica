/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
// Arquivo: src/preliminary-drug-tests/preliminary-drug-tests.controller.ts

import { Controller, Post, Body, UseGuards, Req, Param, Patch, Get, Delete, UseInterceptors, UploadedFile } from '@nestjs/common'; // Adicionados Get, Delete, Param, Patch
import { PreliminaryDrugTestsService } from './preliminary-drug-tests.service';
import { CreatePreliminaryDrugTestDto } from './dto/create-preliminary-drug-test.dto';
import { UpdatePreliminaryDrugTestDto } from './dto/update-preliminary-drug-test.dto'; // Import do Update DTO
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';
import { User } from 'src/users/entities/users.entity';
import { SendToLabDto } from './dto/send-to-lab.dto';
import { FileInterceptor } from '@nestjs/platform-express';

const ALLOWED_ROLES_TO_CREATE = [
  UserRole.SERVIDOR_ADMINISTRATIVO,
  UserRole.PERITO_OFICIAL,
];

@Controller('preliminary-drug-tests')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PreliminaryDrugTestsController {
  constructor(
    private readonly pdtService: PreliminaryDrugTestsService,
  ) {}

  @Post()
  @Roles(...ALLOWED_ROLES_TO_CREATE)
  create(
    @Body() createDto: CreatePreliminaryDrugTestDto,
    @Req() req: any,
  ) {
    const creatingUser: User = req.user;
    return this.pdtService.create(createDto, creatingUser);
  }

  // Adicionando o método findAll (qualquer usuário logado pode ver)
  @Get()
  findAll() {
    return this.pdtService.findAll();
  }

  // Adicionando o método findOne (qualquer usuário logado pode ver)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pdtService.findOne(id);
  }

 @Patch(':id')
  @Roles(...ALLOWED_ROLES_TO_CREATE, UserRole.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePreliminaryDrugTestDto,
    @Req() req: any, // 1. Injetamos a requisição
  ) {
    const currentUser: User = req.user; // 2. Pegamos o usuário do token
    return this.pdtService.update(id, updateDto, currentUser); // 3. Passamos o terceiro argumento
  }
  @Patch(':id/send-to-lab')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
  sendToLab(
    @Param('id') id: string,
    @Body() sendToLabDto: SendToLabDto,
  ) {
    return this.pdtService.sendToLab(id, sendToLabDto);
  }

  // Apenas o SUPER_ADMIN pode deletar
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.pdtService.remove(id);
  }
}