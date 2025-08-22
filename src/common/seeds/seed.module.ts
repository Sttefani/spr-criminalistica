/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { AdminUserSeedService } from './admin-user-seed.service';

@Module({
  // Esta importação é crucial. Ela registra a entidade User com o TypeORM
  // dentro do escopo deste módulo, permitindo que @InjectRepository(User) funcione.
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  
  // Declara o serviço de seed como um provedor para que o NestJS possa instanciá-lo.
  providers: [AdminUserSeedService],
})
export class SeedModule {}