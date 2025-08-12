// Arquivo: src/users/users.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards'
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './enums/users-role.enum';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApproveUserDto } from './dto/approve-user.dto'; // Importe o novo DTO

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // --- ESTE É O LUGAR CORRETO PARA O SEU NOVO MÉTODO ---
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('pending') // Define a rota como GET /users/pending
  findPending() {
    // Ele chama o método do serviço que faz o trabalho de verdade
    return this.usersService.findPending();
  }
  // --- FIM DO NOVO MÉTODO ---

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  // --- ENDPOINT DE APROVAÇÃO ---
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Patch(':id/approve') // A URL será PATCH /users/ID_DO_USUARIO/approve
approveUser(@Param('id') id: string, @Body() approveUserDto: ApproveUserDto) {
  return this.usersService.approve(id, approveUserDto);
}
// --- ENDPOINT DE REJEIÇÃO ---
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Patch(':id/reject') // A URL será PATCH /users/ID_DO_USUARIO/reject
rejectUser(@Param('id') id: string) {
  return this.usersService.reject(id);
}


}