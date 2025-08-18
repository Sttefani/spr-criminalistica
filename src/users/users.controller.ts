// DENTRO DE: src/users/users.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
// 👇 AQUI ESTÁ A IMPORTAÇÃO CORRETA
import { AuthGuard } from '@nestjs/passport'; 
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './enums/users-role.enum';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApproveUserDto } from './dto/approve-user.dto';
// A importação do JwtAuthGuard foi removida

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor) // <-- ADICIONE ESTA LINHA
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 👇 Usando a sintaxe correta
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('pending')
  findPending() {
    return this.usersService.findPending();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Os métodos abaixo ainda precisam ser protegidos, mas faremos isso depois
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/approve')
  approveUser(@Param('id') id: string, @Body() approveUserDto: ApproveUserDto) {
    return this.usersService.approve(id, approveUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/reject')
  rejectUser(@Param('id') id: string) {
    return this.usersService.reject(id);
  }
}