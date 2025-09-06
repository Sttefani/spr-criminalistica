/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './enums/users-role.enum';
import { UserStatus } from './enums/users-status.enum';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApproveUserDto } from './dto/approve-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL) // <-- Adicione aqui!
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: UserStatus,
    @Query('search') search?: string,
    @Query('role') role?: string, // Aceita 'role' como uma string simples
  ) {
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;

    return this.usersService.findAll(
      parsedPage,
      parsedLimit,
      status,
      search,
      role, // Passa a string para o serviço
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get('pending')
  findPending() {
    return this.usersService.findPending();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.PERITO_OFICIAL, UserRole.SERVIDOR_ADMINISTRATIVO)
@Get(':id/forensic-services')
getUserForensicServices(@Param('id') id: string) {
  return this.usersService.getUserForensicServices(id);
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Post(':id/forensic-services')
linkUserToForensicServices(
  @Param('id') userId: string,
  @Body() dto: { forensicServiceIds: string[] }
) {
  return this.usersService.linkUserToForensicServices(userId, dto.forensicServiceIds);
}
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id/forensic-services/:serviceId')
  unlinkUserFromForensicService(
    @Param('id') userId: string,
    @Param('serviceId') serviceId: string
  ) {
  return this.usersService.unlinkUserFromForensicService(userId, serviceId);
}
}