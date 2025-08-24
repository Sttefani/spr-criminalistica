/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthoritiesService } from './authorities.service';
import { AuthoritiesController } from './authorities.controller';
import { Authority } from './entities/authority.entity';
import { User } from 'src/users/entities/users.entity';
// A importação do UsersModule NÃO é mais necessária aqui

@Module({
  imports: [
    // Este módulo precisa dos repositórios de Authority e User,
    // pois o AuthoritiesService os utiliza.
    TypeOrmModule.forFeature([Authority, User]),

    // A importação do UsersModule foi removida.
  ],
  controllers: [AuthoritiesController],
  providers: [AuthoritiesService],
  exports: [AuthoritiesService], // Exportar o serviço é uma boa prática
})
export class AuthoritiesModule {}