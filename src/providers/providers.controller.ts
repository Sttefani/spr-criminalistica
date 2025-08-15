import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

@Controller('providers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL)
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Get()
  findAll() {
    return this.providersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO, UserRole.PERITO_OFICIAL)
  update(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.providersService.remove(id);
  }
}