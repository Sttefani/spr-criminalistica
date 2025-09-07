/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseBoolPipe } from '@nestjs/common';
import { GeneralOccurrencesService } from './general-occurrences.service';
import { CreateGeneralOccurrenceDto } from './dto/create-general-occurrence.dto';
import { UpdateGeneralOccurrenceDto } from './dto/update-general-occurrence.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/users-role.enum';

const ALLOWED_ROLES_TO_MANAGE = [ 
  UserRole.SERVIDOR_ADMINISTRATIVO, 
  UserRole.PERITO_OFICIAL, 
  UserRole.SUPER_ADMIN 
];

@Controller('general-occurrences')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GeneralOccurrencesController {
  constructor(private readonly occurrencesService: GeneralOccurrencesService) {}

  @Post()
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  create(@Body() createDto: CreateGeneralOccurrenceDto, @Req() req: any) {
    return this.occurrencesService.create(createDto, req.user);
  }

  @Get()
  findAllPaginated(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    // ✅ 1. Adicionado parâmetro para o filtro de serviço
    @Query('forensicServiceId') forensicServiceId?: string,
    // ✅ 2. Adicionado parâmetro para o filtro "Minhas Ocorrências"
    @Query('onlyMine', new ParseBoolPipe({ optional: true })) onlyMine?: boolean,
    @Req() req?: any
  ) {
    return this.occurrencesService.findAllPaginated(
      parseInt(page), 
      parseInt(limit), 
      search, 
      req?.user,
      forensicServiceId, 
      onlyMine 
  );
}
  
 
  @Get('my-occurrences')
  findMyOccurrences(@Req() req: any) {
    return this.occurrencesService.findAllForUser(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.occurrencesService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(...ALLOWED_ROLES_TO_MANAGE)
  update(@Param('id') id: string, @Body() updateDto: UpdateGeneralOccurrenceDto, @Req() req: any) {
    return this.occurrencesService.update(id, updateDto, req.user);
  }

@Patch(':id/status')
@Roles(UserRole.SUPER_ADMIN, UserRole.SERVIDOR_ADMINISTRATIVO)
changeStatus(
  @Param('id') id: string, 
  @Body() statusData: { newStatus: string; observations?: string },
  @Req() req: any
) {
  return this.occurrencesService.changeStatus(
    id, 
    statusData.newStatus, 
    statusData.observations?.trim() || null, 
    req.user
  );
}
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.occurrencesService.remove(id, req.user);
  }
}

