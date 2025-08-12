// Arquivo: src/authorities/authorities.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthoritiesService } from './authorities.service';
import { AuthoritiesController } from './authorities.controller';
import { Authority } from './entities/authority.entity';
import { User } from 'src/users/entities/users.entity'; // IMPORTE O USER

@Module({
  imports: [TypeOrmModule.forFeature([Authority, User])], // ADICIONE O USER AQUI
  controllers: [AuthoritiesController],
  providers: [AuthoritiesService],
})
export class AuthoritiesModule {}